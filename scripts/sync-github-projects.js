const fs = require("fs/promises");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "portfolio.projects.json");
const outputPath = path.join(rootDir, "public", "github-projects.json");

const defaultConfig = {
  username: "venki11555",
  maxVisibleProjects: 6,
  excludePublicRepos: [],
  featuredPrivateProjects: [],
};

async function readConfig() {
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...parsed,
      excludePublicRepos: Array.isArray(parsed.excludePublicRepos) ? parsed.excludePublicRepos : [],
      featuredPrivateProjects: Array.isArray(parsed.featuredPrivateProjects)
        ? parsed.featuredPrivateProjects
        : [],
    };
  } catch (error) {
    if (error.code === "ENOENT") {
      return defaultConfig;
    }

    throw error;
  }
}

async function githubRequest(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-project-sync",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub request failed with ${response.status}: ${body.slice(0, 200)}`);
  }

  return response.json();
}

async function fetchAllPublicRepos(username) {
  const repos = [];
  let page = 1;

  while (true) {
    const url = new URL(`https://api.github.com/users/${username}/repos`);
    url.searchParams.set("type", "owner");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const pageRepos = await githubRequest(url, "");
    repos.push(...pageRepos);

    if (pageRepos.length < 100) {
      return repos;
    }

    page += 1;
  }
}

async function fetchPrivateRepo(username, repoName, token) {
  if (!token) {
    return null;
  }

  return githubRequest(`https://api.github.com/repos/${username}/${repoName}`, token);
}

function toPortfolioProject(repo, overrides = {}) {
  const isPrivate = Boolean(repo.private);

  return {
    name: repo.name,
    title: overrides.title || repo.name,
    html_url: overrides.repositoryUrl || repo.html_url,
    description: overrides.description ?? repo.description ?? null,
    homepage: overrides.homepage ?? repo.homepage ?? null,
    language: overrides.language ?? repo.language ?? null,
    stargazers_count: repo.stargazers_count ?? 0,
    pushed_at: repo.pushed_at ?? repo.updated_at ?? null,
    visibility: isPrivate ? "private" : "public",
    tags: Array.isArray(overrides.tags) ? overrides.tags : [],
    repositoryLinkEnabled:
      typeof overrides.repositoryLinkEnabled === "boolean"
        ? overrides.repositoryLinkEnabled
        : !isPrivate,
    featured: typeof overrides.featured === "boolean" ? overrides.featured : isPrivate,
  };
}

function byProjectPriority(a, b) {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  const aDate = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
  const bDate = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;

  return bDate - aDate;
}

async function buildProjectFeed() {
  const config = await readConfig();
  const username = process.env.PORTFOLIO_GITHUB_USERNAME || config.username;
  const token = process.env.PORTFOLIO_GITHUB_TOKEN || "";
  const excludedRepos = new Set(config.excludePublicRepos);

  const publicRepos = await fetchAllPublicRepos(username);
  const publicProjects = publicRepos
    .filter((repo) => !repo.fork && !excludedRepos.has(repo.name))
    .map((repo) => toPortfolioProject(repo, { featured: false }));

  const privateProjects = [];

  for (const projectConfig of config.featuredPrivateProjects) {
    if (!projectConfig || !projectConfig.repo) {
      continue;
    }

    if (!token) {
      console.warn(
        `Skipping private repo "${projectConfig.repo}" because PORTFOLIO_GITHUB_TOKEN is not set.`,
      );
      continue;
    }

    try {
      const repo = await fetchPrivateRepo(username, projectConfig.repo, token);
      privateProjects.push(toPortfolioProject(repo, projectConfig));
    } catch (error) {
      console.warn(`Failed to sync private repo "${projectConfig.repo}": ${error.message}`);
    }
  }

  const projects = [...privateProjects, ...publicProjects].sort(byProjectPriority);

  return {
    generatedAt: new Date().toISOString(),
    username,
    totalCount: projects.length,
    maxVisibleProjects: config.maxVisibleProjects,
    projects,
  };
}

async function main() {
  const payload = await buildProjectFeed();

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${payload.projects.length} GitHub projects for ${payload.username} -> ${path.relative(rootDir, outputPath)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
