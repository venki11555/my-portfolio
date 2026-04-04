import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;1,300&family=Share+Tech+Mono&display=swap');
  `}</style>
);

/* ─── GLOBAL STYLES ─── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cyan: #00f5ff;
      --gold: #ffd700;
      --purple: #b44fff;
      --dark: #020a12;
      --dark2: #041020;
      --card-bg: rgba(0,245,255,0.04);
      --border: rgba(0,245,255,0.18);
      --text: #c8e8f0;
      --glow-cyan: 0 0 20px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.25);
      --glow-gold: 0 0 20px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.25);
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--dark);
      color: var(--text);
      font-family: 'Exo 2', sans-serif;
      overflow-x: hidden;
      cursor: default;
    }
    @media (hover: hover) and (pointer: fine) {
      body { cursor: none; }
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--dark2); }
    ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }

    /* ── Cursor ── */
    .cursor-dot {
      position: fixed; z-index: 9999; pointer-events: none;
      width: 8px; height: 8px; background: var(--cyan);
      border-radius: 50%; transform: translate(-50%, -50%);
      box-shadow: var(--glow-cyan);
      transition: transform 0.1s;
    }
    .cursor-ring {
      position: fixed; z-index: 9998; pointer-events: none;
      width: 36px; height: 36px; border: 1.5px solid var(--cyan);
      border-radius: 50%; transform: translate(-50%, -50%);
      opacity: 0.5; transition: all 0.18s ease;
    }
    .cursor-ring.expand { width: 56px; height: 56px; opacity: 0.3; border-color: var(--gold); }

    /* ── Canvas BG ── */
    #neural-canvas {
      position: fixed; inset: 0; z-index: 0;
      pointer-events: none;
    }

    /* ── Nav ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 6vw;
      background: linear-gradient(180deg, rgba(2,10,18,0.98) 0%, transparent 100%);
      backdrop-filter: blur(8px);
    }
    .nav-logo {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem; font-weight: 900;
      color: var(--cyan); letter-spacing: 0.12em;
      text-shadow: var(--glow-cyan);
    }
    .nav-links {
      display: flex;
      gap: 2.4rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .nav-links a {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.82rem; color: var(--text);
      text-decoration: none; letter-spacing: 0.12em;
      text-transform: uppercase; position: relative;
      transition: color 0.2s;
    }
    .nav-links a::after {
      content: ''; position: absolute; bottom: -4px; left: 0;
      width: 0; height: 1px; background: var(--cyan);
      transition: width 0.3s;
    }
    .nav-links a:hover { color: var(--cyan); }
    .nav-links a:hover::after { width: 100%; }

    /* ── Sections ── */
    section {
      position: relative; z-index: 1;
      padding: 110px 6vw 80px;
      scroll-margin-top: 110px;
      max-width: 1280px; margin: 0 auto;
    }

    /* ── Section Title ── */
    .section-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem; color: var(--cyan);
      letter-spacing: 0.25em; text-transform: uppercase;
      margin-bottom: 10px; opacity: 0.7;
    }
    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(1.6rem, 3vw, 2.6rem);
      font-weight: 900; color: #fff;
      margin-bottom: 56px;
      position: relative; display: inline-block;
    }
    .section-title::after {
      content: ''; position: absolute;
      bottom: -10px; left: 0;
      width: 60%; height: 2px;
      background: linear-gradient(90deg, var(--cyan), transparent);
    }

    /* ── Hero ── */
    #hero {
      min-height: 100vh; display: flex;
      flex-direction: column; justify-content: center;
      padding-top: 80px;
    }
    .hero-sub {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem; color: var(--cyan);
      letter-spacing: 0.2em; margin-bottom: 20px;
      opacity: 0; animation: fadeUp 0.6s 0.3s forwards;
    }
    .hero-name {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(2.4rem, 6vw, 5.5rem);
      font-weight: 900; line-height: 1.05;
      color: #fff; margin-bottom: 16px;
      opacity: 0; animation: fadeUp 0.6s 0.5s forwards;
    }
    .hero-name .accent { color: var(--cyan); text-shadow: var(--glow-cyan); }
    .hero-role {
      font-size: clamp(1rem, 2vw, 1.35rem);
      font-weight: 300; color: var(--gold);
      letter-spacing: 0.06em; margin-bottom: 32px;
      opacity: 0; animation: fadeUp 0.6s 0.7s forwards;
      font-style: italic;
    }
    .hero-desc {
      max-width: 600px;
      font-size: 0.97rem; line-height: 1.75;
      color: rgba(200,232,240,0.75);
      margin-bottom: 48px;
      opacity: 0; animation: fadeUp 0.6s 0.9s forwards;
    }
    .hero-ctas {
      display: flex; gap: 20px; flex-wrap: wrap;
      opacity: 0; animation: fadeUp 0.6s 1.1s forwards;
    }
    .btn-primary {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.78rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      padding: 14px 32px; border: none;
      background: var(--cyan); color: var(--dark);
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
      cursor: pointer; transition: all 0.25s;
      text-decoration: none; display: inline-block;
    }
    .btn-primary:hover {
      background: var(--gold);
      box-shadow: var(--glow-gold);
      transform: translateY(-3px);
    }
    .btn-outline {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.78rem; font-weight: 700;
      letter-spacing: 0.15em; text-transform: uppercase;
      padding: 13px 32px;
      background: transparent;
      border: 1.5px solid var(--cyan); color: var(--cyan);
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
      cursor: pointer; transition: all 0.25s;
      text-decoration: none; display: inline-block;
    }
    .btn-outline:hover {
      background: rgba(0,245,255,0.1);
      box-shadow: var(--glow-cyan);
      transform: translateY(-3px);
    }
    .hero-contacts {
      margin-top: 64px;
      display: flex; gap: 28px; flex-wrap: wrap;
      opacity: 0; animation: fadeUp 0.6s 1.3s forwards;
    }
    .contact-chip {
      display: flex; align-items: center; gap: 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.78rem; color: rgba(200,232,240,0.6);
      border: 1px solid var(--border); padding: 8px 14px;
      border-radius: 2px; text-decoration: none;
      transition: all 0.25s; background: var(--card-bg);
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .contact-chip:hover { color: var(--cyan); border-color: var(--cyan); }
    .contact-chip svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }

    /* ── Glitch ── */
    .glitch { position: relative; }
    .glitch::before, .glitch::after {
      content: attr(data-text);
      position: absolute; inset: 0;
      font-family: inherit; font-size: inherit;
      font-weight: inherit; color: inherit;
    }
    .glitch::before {
      color: var(--cyan); clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
      animation: glitch1 3s infinite 1s; opacity: 0.6;
    }
    .glitch::after {
      color: var(--gold); clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%);
      animation: glitch2 3s infinite 1.5s; opacity: 0.4;
    }

    /* ── Skills Grid ── */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
      gap: 24px;
    }
    .skill-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 28px 24px;
      position: relative; overflow: hidden; min-width: 0;
      transition: all 0.3s;
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    }
    .skill-card::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(0,245,255,0.06) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.3s;
    }
    .skill-card:hover { border-color: rgba(0,245,255,0.5); transform: translateY(-4px); }
    .skill-card:hover::before { opacity: 1; }
    .skill-cat {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.75rem; font-weight: 700;
      color: var(--cyan); letter-spacing: 0.18em;
      text-transform: uppercase; margin-bottom: 18px;
    }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.74rem; color: var(--text);
      background: rgba(0,245,255,0.06);
      border: 1px solid rgba(0,245,255,0.2);
      padding: 5px 12px; border-radius: 1px;
      transition: all 0.2s;
    }
    .skill-tag:hover { background: rgba(0,245,255,0.14); color: var(--cyan); }

    /* ── Timeline ── */
    .timeline { position: relative; padding-left: 40px; }
    .timeline::before {
      content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px;
      width: 2px;
      background: linear-gradient(180deg, var(--cyan), var(--purple), var(--gold));
    }
    .tl-item { position: relative; margin-bottom: 52px; }
    .tl-dot {
      position: absolute; left: -36px; top: 6px;
      width: 16px; height: 16px;
      border: 2px solid var(--cyan);
      background: var(--dark); border-radius: 50%;
      box-shadow: var(--glow-cyan);
    }
    .tl-dot::after {
      content: ''; position: absolute; inset: 3px;
      background: var(--cyan); border-radius: 50%;
      animation: pulse 2s infinite;
    }
    .tl-year {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem; color: var(--gold);
      letter-spacing: 0.15em; margin-bottom: 8px;
    }
    .tl-role {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.05rem; font-weight: 700; color: #fff;
      margin-bottom: 4px;
    }
    .tl-company {
      font-size: 0.85rem; color: var(--cyan);
      margin-bottom: 16px; font-style: italic;
    }
    .tl-bullets { list-style: none; }
    .tl-bullets li {
      font-size: 0.88rem; line-height: 1.7;
      color: rgba(200,232,240,0.72);
      padding-left: 18px; position: relative;
      margin-bottom: 6px;
    }
    .tl-bullets li::before {
      content: '›'; position: absolute; left: 0;
      color: var(--cyan); font-size: 1rem;
    }

    /* ── Projects ── */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
      gap: 28px;
    }
    .project-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 36px 30px;
      position: relative; overflow: hidden; min-width: 0;
      transition: all 0.35s;
      clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
      transform-style: preserve-3d;
    }
    .project-card::after {
      content: ''; position: absolute;
      top: -50%; left: -50%; width: 200%; height: 200%;
      background: conic-gradient(transparent 0deg, rgba(0,245,255,0.04) 60deg, transparent 120deg);
      animation: spin 8s linear infinite;
      opacity: 0; transition: opacity 0.4s;
    }
    .project-card:hover { border-color: rgba(0,245,255,0.55); transform: translateY(-6px); }
    .project-card:hover::after { opacity: 1; }
    .project-num {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.8rem; font-weight: 900;
      color: rgba(0,245,255,0.08);
      position: absolute; top: 20px; right: 24px;
      line-height: 1;
    }
    .project-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.05rem; font-weight: 700;
      color: #fff; margin-bottom: 12px; position: relative; z-index: 1;
    }
    .project-repo {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      color: rgba(200,232,240,0.54);
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
      letter-spacing: 0.06em;
      overflow-wrap: anywhere;
    }
    .project-stack { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .stack-badge {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem; color: var(--gold);
      border: 1px solid rgba(255,215,0,0.3);
      padding: 3px 10px; background: rgba(255,215,0,0.05);
    }
    .project-desc {
      font-size: 0.86rem; line-height: 1.75;
      color: rgba(200,232,240,0.68); position: relative; z-index: 1;
    }
    .project-meta {
      display: flex; flex-wrap: wrap; gap: 10px;
      margin-top: 18px; position: relative; z-index: 1;
    }
    .project-meta span {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem; color: rgba(200,232,240,0.6);
    }
    .project-links {
      display: flex; gap: 12px; flex-wrap: wrap;
      margin-top: 22px; position: relative; z-index: 1;
    }
    .project-link {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.76rem; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--cyan);
      text-decoration: none; border: 1px solid rgba(0,245,255,0.28);
      padding: 8px 12px; transition: all 0.2s;
      background: rgba(0,245,255,0.04);
    }
    .project-link:hover {
      color: var(--dark);
      background: var(--cyan);
      box-shadow: var(--glow-cyan);
    }
    .project-accent {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--cyan), var(--purple), transparent);
    }
    .projects-footer {
      margin-top: 28px;
      display: flex;
      justify-content: center;
    }

    /* ── Stat strip ── */
    .stat-strip {
      display: flex; gap: 0; flex-wrap: wrap;
      border: 1px solid var(--border);
      margin-bottom: 80px;
      background: var(--card-bg);
    }
    .stat-item {
      flex: 1; min-width: 160px; text-align: center;
      padding: 32px 20px; border-right: 1px solid var(--border);
      position: relative; overflow: hidden;
    }
    .stat-item:last-child { border-right: none; }
    .stat-num {
      font-family: 'Orbitron', sans-serif;
      font-size: 2.4rem; font-weight: 900;
      color: var(--cyan); text-shadow: var(--glow-cyan);
      display: block; line-height: 1;
    }
    .stat-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem; color: rgba(200,232,240,0.5);
      letter-spacing: 0.15em; text-transform: uppercase;
      margin-top: 8px; display: block;
    }
    .profile-summary {
      max-width: 860px;
      margin-bottom: 56px;
      font-size: 0.94rem;
      line-height: 1.85;
      color: rgba(200,232,240,0.74);
      border: 1px solid var(--border);
      background: var(--card-bg);
      padding: 24px 26px;
    }
    .section-intro {
      max-width: 780px;
      margin-bottom: 34px;
      font-size: 0.92rem;
      line-height: 1.8;
      color: rgba(200,232,240,0.72);
    }
    .subsection-block { margin-top: 56px; }
    .card-copy {
      font-size: 0.86rem;
      line-height: 1.75;
      color: rgba(200,232,240,0.7);
      margin-bottom: 18px;
      position: relative;
      z-index: 1;
    }
    .project-points {
      margin-top: 16px;
      position: relative;
      z-index: 1;
    }

    /* ── Contact Section ── */
    .contact-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 40px; align-items: start;
    }
    @media(max-width: 680px) { .contact-grid { grid-template-columns: 1fr; } }
    .contact-info p {
      font-size: 0.92rem; line-height: 1.8;
      color: rgba(200,232,240,0.7); margin-bottom: 32px;
    }
    .contact-links { display: flex; flex-direction: column; gap: 16px; }
    .contact-link-row {
      display: flex; align-items: center; gap: 14px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.82rem; color: var(--text);
      text-decoration: none; padding: 14px 18px;
      border: 1px solid var(--border); background: var(--card-bg);
      transition: all 0.25s;
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .contact-link-row:hover { border-color: var(--cyan); color: var(--cyan); }
    .contact-link-icon { width: 16px; height: 16px; stroke: currentColor; fill: none; flex-shrink: 0; }
    .contact-right {
      background: var(--card-bg); border: 1px solid var(--border);
      padding: 40px; position: relative; overflow: hidden;
    }
    .available-tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem; color: #00ff88;
      border: 1px solid rgba(0,255,136,0.3);
      padding: 6px 14px; margin-bottom: 24px;
    }
    .avail-dot {
      width: 8px; height: 8px; background: #00ff88;
      border-radius: 50%; animation: pulse 1.5s infinite;
    }
    .location-line {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.8rem; color: rgba(200,232,240,0.5);
      margin-bottom: 8px;
    }
    .certs-list { margin-top: 28px; }
    .cert-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 0; border-bottom: 1px solid var(--border);
      font-size: 0.84rem; line-height: 1.5;
    }
    .cert-item:last-child { border-bottom: none; }
    .cert-dot { width: 6px; height: 6px; background: var(--cyan); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }

    /* ── Footer ── */
    footer {
      position: relative; z-index: 1;
      text-align: center; padding: 40px 6vw;
      border-top: 1px solid var(--border);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem; color: rgba(200,232,240,0.35);
      letter-spacing: 0.1em;
    }
    footer span { color: var(--cyan); }

    /* ── Typewriter cursor ── */
    .tw-cursor {
      display: inline-block; width: 3px; height: 1.1em;
      background: var(--cyan); vertical-align: middle;
      margin-left: 4px; animation: blink 1s infinite;
    }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; } 50% { opacity: 0; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes glitch1 {
      0%, 95% { transform: translate(0); }
      96%      { transform: translate(-3px, 1px); }
      97%      { transform: translate(3px, -1px); }
      98%      { transform: translate(0); }
    }
    @keyframes glitch2 {
      0%, 95% { transform: translate(0); }
      96%      { transform: translate(3px, 1px); }
      97%      { transform: translate(-3px, -1px); }
      98%      { transform: translate(0); }
    }
    @keyframes scanline {
      from { transform: translateY(-100%); }
      to   { transform: translateY(100vh); }
    }

    /* ── Scanline overlay ── */
    .scanline {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      overflow: hidden;
    }
    .scanline::after {
      content: ''; position: absolute;
      left: 0; right: 0; height: 3px;
      background: linear-gradient(180deg, transparent, rgba(0,245,255,0.06), transparent);
      animation: scanline 6s linear infinite;
    }

    /* ── Edu cards ── */
    .edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media(max-width: 620px) { .edu-grid { grid-template-columns: 1fr; } }
    .edu-card {
      background: var(--card-bg); border: 1px solid var(--border);
      padding: 28px 24px; position: relative; overflow: hidden;
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
      min-width: 0;
      transition: all 0.3s;
    }
    .edu-card:hover { border-color: rgba(0,245,255,0.5); transform: translateY(-3px); }
    .edu-degree {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 8px;
    }
    .edu-school { font-size: 0.84rem; color: var(--cyan); margin-bottom: 6px; font-style: italic; }
    .edu-year { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(200,232,240,0.45); margin-bottom: 10px; }
    .edu-meta {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.74rem;
      color: rgba(200,232,240,0.58);
      margin-bottom: 12px;
      letter-spacing: 0.04em;
    }
    .edu-cgpa {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.4rem; font-weight: 900; color: var(--gold);
      text-shadow: var(--glow-gold);
    }
    .edu-coursework {
      margin-top: 14px;
      font-size: 0.8rem;
      line-height: 1.7;
      color: rgba(200,232,240,0.66);
    }

    @media (max-width: 980px) {
      nav {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
        padding: 16px 5vw;
      }
      .nav-links {
        gap: 12px 18px;
        justify-content: flex-start;
      }
      section {
        padding: 124px 5vw 76px;
        scroll-margin-top: 124px;
      }
      #hero { padding-top: 120px; }
      .hero-desc,
      .profile-summary,
      .section-intro,
      .contact-info p {
        max-width: none;
      }
      .contact-grid { gap: 28px; }
    }

    @media (max-width: 768px) {
      .nav-logo { font-size: 1rem; }
      .nav-links a {
        font-size: 0.74rem;
        letter-spacing: 0.08em;
      }
      section {
        padding: 118px 20px 68px;
        scroll-margin-top: 118px;
      }
      #hero {
        min-height: auto;
        padding-top: 118px;
      }
      .section-title { margin-bottom: 40px; }
      .hero-sub {
        font-size: 0.72rem;
        line-height: 1.8;
        letter-spacing: 0.14em;
      }
      .hero-role {
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 24px;
      }
      .hero-desc {
        font-size: 0.92rem;
        margin-bottom: 34px;
      }
      .hero-ctas {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
      }
      .btn-primary,
      .btn-outline {
        width: 100%;
        text-align: center;
        padding: 14px 18px;
      }
      .hero-contacts {
        margin-top: 40px;
        gap: 14px;
      }
      .contact-chip {
        width: 100%;
        padding: 12px 14px;
      }
      .stat-strip { margin-bottom: 56px; }
      .stat-item {
        min-width: 50%;
        padding: 26px 16px;
      }
      .stat-item:nth-child(2n) { border-right: none; }
      .profile-summary { padding: 22px 18px; }
      .skill-card,
      .project-card,
      .edu-card,
      .contact-right {
        padding: 24px 18px;
      }
      .project-num {
        font-size: 2.2rem;
        top: 18px;
        right: 18px;
      }
      .project-links {
        flex-direction: column;
        align-items: stretch;
      }
      .project-link { text-align: center; }
      .projects-footer .btn-outline {
        width: 100%;
        text-align: center;
      }
      .contact-link-row {
        padding: 12px 14px;
        align-items: flex-start;
      }
    }

    @media (max-width: 540px) {
      section {
        padding: 112px 18px 60px;
        scroll-margin-top: 112px;
      }
      #hero { padding-top: 110px; }
      .nav-links { gap: 10px 14px; }
      .hero-name {
        font-size: clamp(2.1rem, 15vw, 3.2rem);
        line-height: 1.08;
      }
      .section-label {
        font-size: 0.68rem;
        letter-spacing: 0.18em;
      }
      .section-title {
        font-size: clamp(1.4rem, 8vw, 2rem);
      }
      .skills-grid,
      .projects-grid,
      .edu-grid {
        gap: 18px;
      }
      .stat-item {
        min-width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }
      .stat-item:last-child { border-bottom: none; }
      .project-card {
        padding: 24px 18px 26px;
      }
      .project-repo { padding-right: 44px; }
      .contact-right { padding: 28px 18px; }
      .available-tag { flex-wrap: wrap; }
    }

    @media (hover: none), (pointer: coarse) {
      .cursor-dot,
      .cursor-ring {
        display: none;
      }
      .glitch::before,
      .glitch::after {
        display: none;
      }
      .skill-card:hover,
      .project-card:hover,
      .edu-card:hover,
      .btn-primary:hover,
      .btn-outline:hover,
      .project-link:hover,
      .contact-link-row:hover,
      .contact-chip:hover {
        transform: none;
        box-shadow: none;
      }
    }
  `}</style>
);

/* ── Neural Canvas ── */
function NeuralCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const nodes = useRef([]);
  const animId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const ctx = canvas.getContext("2d");
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const density = prefersReducedMotion ? 52000 : isTouchDevice ? 32000 : 18000;
    const minNodes = prefersReducedMotion ? 10 : isTouchDevice ? 14 : 20;

    const buildNodes = () => {
      const count = Math.max(minNodes, Math.floor((window.innerWidth * window.innerHeight) / density));
      nodes.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.5,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildNodes();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    if (!isTouchDevice) {
      window.addEventListener("mousemove", onMove);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ns = nodes.current;

      // Move
      ns.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = canvas.width;
        if (n.x > canvas.width) n.x = 0;
        if (n.y < 0) n.y = canvas.height;
        if (n.y > canvas.height) n.y = 0;

        // Repel from mouse
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!isTouchDevice && dist > 0 && dist < 120) {
          n.x += (dx / dist) * 1.2;
          n.y += (dy / dist) * 1.2;
        }
      });

      // Lines
      const LINK = 140;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x;
          const dy = ns[i].y - ns[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(ns[i].x, ns[i].y);
            ctx.lineTo(ns[j].x, ns[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      ns.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,245,255,0.55)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f5ff";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("resize", resize);
      if (!isTouchDevice) {
        window.removeEventListener("mousemove", onMove);
      }
    };
  }, []);

  return <canvas id="neural-canvas" ref={canvasRef} />;
}

/* ── Cursor ── */
function CustomCursor() {
  const supportsCustomCursor =
    typeof window === "undefined"
      ? true
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!supportsCustomCursor) {
      return undefined;
    }

    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    let frameId = 0;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) { dotRef.current.style.left = pos.current.x + "px"; dotRef.current.style.top = pos.current.y + "px"; }
      if (ringRef.current) { ringRef.current.style.left = ring.current.x + "px"; ringRef.current.style.top = ring.current.y + "px"; }
      frameId = requestAnimationFrame(loop);
    };
    loop();

    const over = () => ringRef.current?.classList.add("expand");
    const out  = () => ringRef.current?.classList.remove("expand");
    const interactiveElements = Array.from(
      document.querySelectorAll("a, button, .skill-card, .project-card"),
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", move);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", over);
        el.removeEventListener("mouseleave", out);
      });
    };
  }, [supportsCustomCursor]);

  if (!supportsCustomCursor) {
    return null;
  }

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

/* ── Typewriter ── */
function Typewriter({ phrases }) {
  const [text, setText] = useState("");
  const [pi, setPi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    const phrase = phrases[pi % phrases.length];
    if (wait) { const t = setTimeout(() => setWait(false), 1200); return () => clearTimeout(t); }
    if (deleting) {
      if (text.length === 0) { setDeleting(false); setPi(p => p + 1); return; }
      const t = setTimeout(() => setText(s => s.slice(0, -1)), 45);
      return () => clearTimeout(t);
    }
    if (text === phrase) { setWait(true); setDeleting(true); return; }
    const t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 70);
    return () => clearTimeout(t);
  }, [text, pi, deleting, wait, phrases]);

  return <span>{text}<span className="tw-cursor" /></span>;
}

/* ── 3D Tilt card wrapper ── */
function TiltCard({ children, className }) {
  const supportsTilt =
    typeof window === "undefined"
      ? true
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (!supportsTilt) return;
    const el = ref.current; if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  }, [supportsTilt]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={supportsTilt ? onMove : undefined}
      onMouseLeave={supportsTilt ? onLeave : undefined}
    >
      {children}
    </div>
  );
}

/* ─── DATA ─── */
const skills = [
  { cat: "Frontend", tags: ["React.js", "JavaScript", "HTML5", "CSS3", "Bootstrap", "Responsive UI"] },
  { cat: "Backend & APIs", tags: ["Python", "Django", "REST APIs", "SQL", "Authentication", "CRUD"] },
  { cat: "Programming", tags: ["Java", "C", "Data Structures", "OOP", "Problem Solving"] },
  { cat: "AI / ML", tags: ["Scikit-learn", "Pandas", "NumPy", "Model Evaluation", "Machine Learning", "Deep Learning"] },
  { cat: "Tools & Platforms", tags: ["Git", "GitHub", "VS Code", "Postman", "Netlify", "Vercel"] },
  { cat: "Domain Knowledge", tags: ["Banking Workflows", "FinTech Products", "KYC/AML", "Financial Analysis", "Agile Collaboration"] },
];

const githubUsername = "venki11555";
const maxVisibleProjects = 6;
const projectsDataUrl = `${process.env.PUBLIC_URL || ""}/github-projects.json`;

const professionalSummary =
  "Computer Science graduate and frontend developer with hands-on experience building React.js interfaces, responsive UI systems, and business-oriented digital products. My background includes banking-focused application workflows, Django-based full-stack development, and AI/ML project exposure, giving me a practical understanding of both product usability and technical implementation. I enjoy translating requirements into clean, reliable user experiences and I am actively seeking frontend, full-stack, or FinTech opportunities where I can contribute with ownership, adaptability, and strong execution.";

const professionalHighlights = [
  {
    title: "Frontend Delivery",
    description:
      "Build responsive and user-focused interfaces with strong attention to layout structure, usability, and clean implementation for business and banking-oriented applications.",
    tags: ["React.js", "Responsive UI", "User Experience"],
  },
  {
    title: "Full-Stack Exposure",
    description:
      "Comfortable working across the interface and backend boundary through Django, REST APIs, SQL, and integration workflows that support complete product delivery.",
    tags: ["Django", "REST APIs", "SQL"],
  },
  {
    title: "AI / ML Foundation",
    description:
      "Hands-on experience with Python-based data workflows, model evaluation, and machine learning experimentation on real-world business datasets.",
    tags: ["Python", "Scikit-learn", "Pandas"],
  },
  {
    title: "Professional Strengths",
    description:
      "Known for learning quickly, adapting to project needs, collaborating well with teams, and approaching delivery with a practical problem-solving mindset.",
    tags: ["Ownership", "Team Collaboration", "Continuous Learning"],
  },
];

const projectMetadata = {
  pixelaudiowebsite: {
    priority: 1,
    title: "Karnataka Suman TV Website",
    description:
      "Designed by me and delivered as part of project work through Infiny Global Pvt Ltd. The site focuses on structured media presentation, responsive browsing, and a polished content-first experience for viewers.",
    tags: ["Frontend", "Media Platform", "UI Design", "Client Delivery"],
    highlights: [
      "Created a professional layout direction that improves content hierarchy and section readability.",
      "Focused on responsive behavior and practical screen composition for a production-ready browsing experience.",
    ],
  },
  "PROJECT-SNYCON-INFRA": {
    priority: 2,
    title: "Backend Projects",
    description:
      "Backend and infrastructure-oriented repository work that reflects my ability to contribute beyond the UI layer and support real-world application setup, structure, and delivery.",
    tags: ["Backend", "Infrastructure", "JavaScript", "Project Support"],
    highlights: [
      "Shows exposure to project setup and engineering tasks that support broader application development.",
      "Represents my willingness to work across layers instead of limiting contributions to frontend implementation only.",
    ],
  },
  "my-portfolio": {
    priority: 3,
    title: "Portfolio Website",
    description:
      "Personal portfolio built with React.js to present my experience, technical strengths, education, and featured GitHub work in a recruiter-friendly and professional format.",
    tags: ["React.js", "Portfolio", "Personal Branding", "Responsive UI"],
    highlights: [
      "Built to communicate my profile clearly without sacrificing visual personality or responsiveness.",
      "Organizes education, skills, experience, and selected work into a clean one-page presentation for recruiters and hiring teams.",
    ],
  },
  builders: {
    priority: 4,
    title: "Suraksha Builders & Developers Website",
    description:
      "Professional website project created for Suraksha Builders & Developers to present residential and commercial projects with a modern, brand-aligned, and business-focused web experience.",
    tags: ["TypeScript", "Real Estate Website", "React", "Modern UI"],
    highlights: [
      "Designed to showcase property offerings, brand credibility, and project presentation in a clean digital format suitable for client-facing use.",
      "Built as a modern TypeScript-based web experience with structured frontend organization for scalable UI components and content sections.",
      "Focuses on professional visual presentation, usability, and clear communication for a real-estate business audience.",
    ],
  },
  music: {
    priority: 5,
    title: "Music Player Web App",
    description:
      "Modern TypeScript-based music player web application with an Android-inspired experience, progressive web app support, real-time lyrics, and queue-driven playback interactions.",
    tags: ["TypeScript", "Music Player", "PWA", "Real-Time Lyrics"],
    highlights: [
      "Built with a modern React and Vite setup to deliver a polished browser-based music listening experience with app-like behavior.",
      "Includes features such as real-time lyrics, queue management, and media-focused interaction patterns that improve usability for music playback.",
      "Demonstrates my ability to work on richer frontend product experiences beyond standard business websites by combining UI polish with interactive functionality.",
    ],
  },
};

const fallbackProjects = [
  {
    name: "pixelaudiowebsite",
    html_url: "https://github.com/venki11555/pixelaudiowebsite",
    description: null,
    homepage: null,
    language: null,
    stargazers_count: 0,
    pushed_at: "2026-03-05T04:45:14Z",
    visibility: "public",
  },
  {
    name: "PROJECT-SNYCON-INFRA",
    html_url: "https://github.com/venki11555/PROJECT-SNYCON-INFRA",
    description: null,
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    pushed_at: "2026-02-13T12:51:34Z",
    visibility: "public",
  },
  {
    name: "my-portfolio",
    html_url: "https://github.com/venki11555/my-portfolio",
    description: null,
    homepage: null,
    language: "JavaScript",
    stargazers_count: 0,
    pushed_at: "2026-04-01T19:31:20Z",
    visibility: "public",
  },
];

function normalizeProject(project) {
  return {
    name: project.name,
    html_url: project.html_url || "",
    description: project.description || null,
    homepage: project.homepage || null,
    language: project.language || null,
    stargazers_count: project.stargazers_count ?? 0,
    pushed_at: project.pushed_at || null,
    visibility: project.visibility || "public",
  };
}

function getProjectPriority(project) {
  return projectMetadata[project.name]?.priority ?? 100;
}

function byProjectPriority(a, b) {
  const priorityDiff = getProjectPriority(a) - getProjectPriority(b);

  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  const aDate = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
  const bDate = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
  return bDate - aDate;
}

function getProjectTitle(project) {
  return projectMetadata[project.name]?.title || project.name;
}

function formatProjectDate(dateString) {
  if (!dateString) return "Recently updated";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function getProjectDescription(project) {
  return (
    projectMetadata[project.name]?.description
    || project.description
    || "Open this repository on GitHub to view the latest code, commits, and project details."
  );
}

function getProjectTags(project) {
  if (projectMetadata[project.name]?.tags) {
    return projectMetadata[project.name].tags;
  }

  return [
    project.language || "GitHub",
    project.visibility === "private" ? "Private Repo" : "Public Repo",
    `${project.stargazers_count} Stars`,
  ];
}

function getProjectRepoLabel(project) {
  return `${githubUsername}/${project.name}`;
}

function getProjectHighlights(project) {
  return projectMetadata[project.name]?.highlights || [];
}

const internships = [
  {
    year: "1 Year",
    role: "Frontend Developer",
    company: "Infiny Global Private LTD",
    bullets: [
      "Contributed to frontend delivery for banking-focused Android application workflows used in practical business environments",
      "Built and refined interface components to support reliable customer journeys and task-based financial processes",
      "Worked with backend and business teams to translate requirements into clear, usable product screens",
    ],
  },
  {
    year: "2023",
    role: "AI Intern",
    company: "Sun Square Technologies",
    bullets: [
      "Built Python-based AI/ML models on business datasets and supported experimentation across multiple approaches",
      "Performed preprocessing, evaluation, hyperparameter tuning, and benchmarking to improve model quality",
      "Collaborated with engineers to understand how predictive outputs fit into broader workflow needs",
    ],
  },
  {
    year: "2023",
    role: "Python Full Stack Developer Intern",
    company: "Besant Technologies, Bangalore",
    bullets: [
      "Developed end-to-end applications using Django for backend logic and React.js for frontend delivery",
      "Designed and integrated REST APIs to support dynamic data-driven user experiences",
      "Created responsive interfaces with Bootstrap, HTML, and CSS while following structured development practices",
      "Participated in reviews, debugging, and sprint-based delivery with a focus on maintainable code",
    ],
  },
];

const currentFocus = [
  "Frontend or full-stack software roles where I can contribute to production-ready user experiences",
  "FinTech, business applications, or product teams that value ownership, learning, and dependable execution",
  "Opportunities involving React.js, Django, REST API integration, and responsive interface development",
];

const professionalReadiness = [
  {
    title: "Frontend Development",
    points: [
      "Ability to build responsive and user-friendly interfaces with React.js, JavaScript, HTML, and CSS",
      "Understanding of component-based UI structure, layout consistency, and practical usability",
      "Experience adapting screens and flows for business-focused application needs",
    ],
    tags: ["React.js", "JavaScript", "Responsive UI"],
  },
  {
    title: "Backend Integration",
    points: [
      "Knowledge of Django, REST APIs, SQL, and full-stack integration workflows",
      "Ability to work with dynamic data, API-driven screens, and business logic requirements",
      "Comfort collaborating across frontend and backend responsibilities when needed",
    ],
    tags: ["Django", "REST APIs", "SQL"],
  },
  {
    title: "Engineering Practices",
    points: [
      "Use of Git and GitHub for version control, project tracking, and code collaboration",
      "Problem-solving mindset supported by programming fundamentals and debugging practice",
      "Exposure to structured delivery through reviews, iterations, and maintainable implementation",
    ],
    tags: ["Git", "GitHub", "Problem Solving"],
  },
  {
    title: "Professional Readiness",
    points: [
      "Strong willingness to learn quickly and adapt to company tools, standards, and delivery processes",
      "Clear communication and collaboration across technical and business teams",
      "Interest in contributing to IT, product, and FinTech environments with ownership and consistency",
    ],
    tags: ["Teamwork", "Adaptability", "Ownership"],
  },
];

/* ─── MAIN ─── */
export default function Portfolio() {
  const [githubProjects, setGithubProjects] = useState(fallbackProjects.map(normalizeProject));
  const [projectCount, setProjectCount] = useState(fallbackProjects.length);

  useEffect(() => {
    const controller = new AbortController();

    const loadStaticProjects = async () => {
      const response = await fetch(projectsDataUrl, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Projects feed request failed with ${response.status}`);
      }

      const data = await response.json();
      const projects = Array.isArray(data.projects) ? data.projects.map(normalizeProject).sort(byProjectPriority) : [];

      if (projects.length === 0) {
        return false;
      }

      setProjectCount(data.totalCount || projects.length);
      setGithubProjects(projects.slice(0, data.maxVisibleProjects || maxVisibleProjects));
      return true;
    };

    const loadBrowserProjects = async () => {
      const response = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub request failed with ${response.status}`);
      }

      const repos = await response.json();
      const publicRepos = repos.filter((repo) => !repo.fork).map(normalizeProject).sort(byProjectPriority);

      if (publicRepos.length > 0) {
        setProjectCount(publicRepos.length);
        setGithubProjects(publicRepos.slice(0, maxVisibleProjects));
      }
    };

    const loadGitHubProjects = async () => {
      try {
        const loadedStaticProjects = await loadStaticProjects();

        if (loadedStaticProjects) {
          return;
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load generated project feed", error);
        }
      }

      try {
        await loadBrowserProjects();
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load GitHub projects", error);
        }
      }
    };

    loadGitHubProjects();

    return () => controller.abort();
  }, []);

  return (
    <>
      <FontLink />
      <GlobalStyle />
      <CustomCursor />
      <NeuralCanvas />
      <div className="scanline" />

      {/* NAV */}
      <nav>
        <div className="nav-logo">KV<span style={{ color: "#ffd700" }}>.</span></div>
        <div className="nav-links">
          {["About", "Skills", "Experience", "Projects", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-sub">// Frontend Developer · React.js · Django · AI/ML</div>
        <h1 className="hero-name">
          <span className="glitch" data-text="KOLAKATLA">KOLAKATLA</span>
          <br />
          <span className="accent glitch" data-text="VENKATESH">VENKATESH</span>
        </h1>
        <div className="hero-role">
          <Typewriter phrases={[
            "Frontend developer for modern web interfaces",
            "React.js, Django, REST APIs, and AI/ML",
            "Building reliable products for business and fintech use cases",
            "Turning requirements into polished user experiences",
          ]} />
        </div>
        <p className="hero-desc">
          Frontend developer with experience building responsive web interfaces, banking-oriented
          application workflows, and AI/ML-backed projects. I combine clean UI implementation with
          backend awareness in Django and REST APIs to deliver practical, user-focused products.
        </p>
        <div className="hero-ctas">
          <a href="#projects" className="btn-primary">View Projects</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
        <div className="hero-contacts">
          <a href="mailto:venkateshkolakatla94@gmail.com" className="contact-chip">
            <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            venkateshkolakatla94@gmail.com
          </a>
          <a href="https://linkedin.com/in/k-venkatesh-b3b499235" target="_blank" rel="noreferrer" className="contact-chip">
            <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a href="https://github.com/venki11555" target="_blank" rel="noreferrer" className="contact-chip">
            <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            github.com/venki11555
          </a>
          <a href="tel:+919182483997" className="contact-chip">
            <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +91 9182483997
          </a>
        </div>
      </section>

      {/* ABOUT / STATS */}
      <section id="about">
        <div className="section-label">// profile</div>
        <h2 className="section-title">About Me</h2>
        <div className="stat-strip">
          {[
            ["7.8", "CGPA — B.Tech CSE"],
            ["85%", "ML Model Accuracy"],
            ["1 Year", "Banking App Frontend"],
            ["3", "Experience Highlights"],
            [`${projectCount}`, "GitHub Projects"],
          ].map(([n, l]) => (
            <div key={l} className="stat-item">
              <span className="stat-num">{n}</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>
        <p className="profile-summary">{professionalSummary}</p>

        <div className="subsection-block">
          <div className="section-label">// strengths</div>
          <h2 className="section-title">Professional Highlights</h2>
          <div className="skills-grid">
            {professionalHighlights.map((item) => (
              <TiltCard key={item.title} className="skill-card">
                <div className="skill-cat">{item.title}</div>
                <p className="card-copy">{item.description}</p>
                <div className="skill-tags">
                  {item.tags.map((tag) => <span key={`${item.title}-${tag}`} className="skill-tag">{tag}</span>)}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="section-label" style={{ marginTop: 56 }}>// education</div>
        <h2 className="section-title">Education</h2>
        <div className="edu-grid">
          <TiltCard className="edu-card">
            <div className="edu-degree">B.Tech — Computer Science & Engineering</div>
            <div className="edu-school">Jawaharlal Nehru Technological University, Anantapur</div>
            <div className="edu-meta">KMM Institute of Science and Technology College, Tirupati</div>
            <div className="edu-year">2020 — May 2024</div>
            <div className="edu-cgpa">7.8 / 10</div>
            <div className="edu-coursework">
              Relevant coursework: C, Data Structures, Java, Python, Machine Learning, Deep Learning
            </div>
          </TiltCard>
          <TiltCard className="edu-card">
            <div className="edu-degree">Intermediate — MPC</div>
            <div className="edu-school">Board of Intermediate Education, Andhra Pradesh</div>
            <div className="edu-meta">NRI Junior College, Tirupati</div>
            <div className="edu-year">2018 — May 2020</div>
            <div className="edu-cgpa">8.1 / 10</div>
            <div className="edu-coursework">
              Relevant coursework: Mathematics, Physics, Chemistry
            </div>
          </TiltCard>
        </div>

      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="section-label">// capabilities</div>
        <h2 className="section-title">Technical Skills</h2>
        <p className="section-intro">
          My toolkit covers frontend implementation, backend fundamentals, AI/ML experimentation,
          and domain awareness for business and fintech-oriented products.
        </p>
        <div className="skills-grid">
          {skills.map(s => (
            <TiltCard key={s.cat} className="skill-card">
              <div className="skill-cat">{s.cat}</div>
              <div className="skill-tags">
                {s.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="subsection-block">
          <div className="section-label">// readiness</div>
          <h2 className="section-title">Professional Readiness</h2>
          <p className="section-intro">
            This section highlights the practical strengths I can bring into a software team,
            including technical capability, collaboration, and adaptability to project needs.
          </p>
          <div className="skills-grid">
            {professionalReadiness.map((item) => (
              <TiltCard key={item.title} className="skill-card">
                <div className="skill-cat">{item.title}</div>
                <ul className="tl-bullets project-points">
                  {item.points.map((point) => <li key={`${item.title}-${point}`}>{point}</li>)}
                </ul>
                <div className="skill-tags" style={{ marginTop: 18 }}>
                  {item.tags.map((tag) => <span key={`${item.title}-${tag}`} className="skill-tag">{tag}</span>)}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-label">// work history</div>
        <h2 className="section-title">Experience</h2>
        <p className="section-intro">
          Each role has strengthened a different part of my profile, from production-facing UI
          delivery to full-stack development and AI/ML experimentation on business use cases.
        </p>
        <div className="timeline">
          {internships.map(i => (
            <div key={i.role} className="tl-item">
              <div className="tl-dot" />
              <div className="tl-year">{i.year}</div>
              <div className="tl-role">{i.role}</div>
              <div className="tl-company">{i.company}</div>
              <ul className="tl-bullets">
                {i.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-label">// builds</div>
        <h2 className="section-title">Featured GitHub Projects</h2>
        <p className="section-intro">
          These projects represent the work that best reflects my current profile across personal
          branding, interface development, and broader engineering exposure.
        </p>
        <div className="projects-grid">
          {githubProjects.map((project, idx) => (
            <TiltCard key={project.html_url} className="project-card">
              <div className="project-num">0{idx + 1}</div>
              <div className="project-title">{getProjectTitle(project)}</div>
              <div className="project-repo">GitHub: {getProjectRepoLabel(project)}</div>
              <div className="project-stack">
                {getProjectTags(project).map((tag) => (
                  <span key={`${project.html_url}-${tag}`} className="stack-badge">{tag}</span>
                ))}
              </div>
              <p className="project-desc">{getProjectDescription(project)}</p>
              {getProjectHighlights(project).length > 0 && (
                <ul className="tl-bullets project-points">
                  {getProjectHighlights(project).map((point) => <li key={`${project.name}-${point}`}>{point}</li>)}
                </ul>
              )}
              <div className="project-meta">
                <span>Updated {formatProjectDate(project.pushed_at)}</span>
              </div>
              <div className="project-links">
                <a href={project.html_url} target="_blank" rel="noreferrer" className="project-link">
                  View Repository
                </a>
                {project.homepage && (
                  <a href={project.homepage} target="_blank" rel="noreferrer" className="project-link">
                    Live Demo
                  </a>
                )}
              </div>
              <div className="project-accent" />
            </TiltCard>
          ))}
        </div>
        <div className="projects-footer">
          <a href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-outline">
            View All GitHub Projects
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-label">// connect</div>
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p>
              I am actively seeking entry-level frontend, full-stack, and FinTech opportunities
              where I can contribute to real products, continue learning quickly, and grow within
              a collaborative engineering environment. Open to full-time roles, internships, and
              project-based work across India.
            </p>
            <div className="contact-links">
              <a href="mailto:venkateshkolakatla94@gmail.com" className="contact-link-row">
                <svg className="contact-link-icon" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                venkateshkolakatla94@gmail.com
              </a>
              <a href="https://linkedin.com/in/k-venkatesh-b3b499235" target="_blank" rel="noreferrer" className="contact-link-row">
                <svg className="contact-link-icon" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                linkedin.com/in/k-venkatesh-b3b499235
              </a>
              <a href="https://github.com/venki11555" target="_blank" rel="noreferrer" className="contact-link-row">
                <svg className="contact-link-icon" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                github.com/venki11555
              </a>
              <span className="contact-link-row">
                <svg className="contact-link-icon" viewBox="0 0 24 24" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Andhra Pradesh, India
              </span>
            </div>
          </div>

          <div className="contact-right">
            <div className="available-tag">
              <div className="avail-dot" /> AVAILABLE FOR IMMEDIATE JOINING
            </div>
            <div className="location-line">Open to relocation across India</div>
            <div className="location-label" style={{ marginBottom: 20, fontSize: "0.8rem", color: "rgba(200,232,240,0.5)", fontFamily: "'Share Tech Mono', monospace" }}>Based in Andhra Pradesh, India</div>
            <div className="certs-list" style={{ marginTop: 0, marginBottom: 22 }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", color: "var(--cyan)", letterSpacing: "0.18em", marginBottom: 14 }}>CURRENT FOCUS</div>
              {currentFocus.map((item) => (
                <div key={item} className="cert-item">
                  <div className="cert-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="certs-list">
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.78rem", color: "var(--cyan)", letterSpacing: "0.18em", marginBottom: 14 }}>CERTIFICATIONS</div>
              {[
                "NPTEL — Cloud Computing (IIT / NPTEL)",
                "Python for Data Science — Besant Technologies",
                "Foundational preparation in banking and financial services workflows",
              ].map(c => (
                <div key={c} className="cert-item">
                  <div className="cert-dot" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span>KOLAKATLA VENKATESH</span> — Designed & built with React.js · {new Date().getFullYear()}
      </footer>
    </>
  );
}
