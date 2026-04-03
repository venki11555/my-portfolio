# venkateshk-my-portfolio

This portfolio now builds its projects section from `public/github-projects.json`.

## Private GitHub projects

1. Add the repos you want to feature to `portfolio.projects.json` under `featuredPrivateProjects`.
2. Add a public-safe `description` for each private repo so the website does not expose sensitive details.
3. Set the `PORTFOLIO_GITHUB_TOKEN` secret in GitHub Actions with access to those private repos.
4. Run `npm run sync:projects` locally, or let `npm run build` generate the feed automatically.

Example entry:

```json
{
  "repo": "private-repo-name",
  "title": "Client Delivery Platform",
  "description": "Internal platform for workflow automation, reporting, and review dashboards.",
  "tags": ["React", "Django", "Automation"],
  "repositoryLinkEnabled": false
}
```
