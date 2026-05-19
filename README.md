# M's Web Development Guide

A comprehensive, chronological web development textbook built as a clean static website. Teaches from absolute beginner to production-ready engineer — HTML, CSS, JavaScript, React, PHP, deployment, scaling, and the senior mindset.

## Prerequisites

- None — this is a static website, no build tools or server required
- A modern web browser
- A local server for local development (see below)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/web-dev-textbook.git
cd web-dev-textbook

# Serve locally
cd textbook/public
python -m http.server 8080
```

Open http://localhost:8080 in your browser.

## Usage

Read the chapters in order — each builds on the last. Use the sidebar to navigate between chapters. Toggle dark/light mode using the button in the header.

### Chapters

| # | Chapter | Part |
|---|---|---|
| 01 | How the Web Works | First Steps |
| 02 | How the Browser Works | First Steps |
| 03 | The Command Line & Local Dev | Foundations |
| 04 | Git & Version Control | Foundations |
| 05 | Folder Structure & Docs | Foundations |
| 06 | HTML | Tooling |
| 07 | CSS | Tooling |
| 08 | JavaScript | Tooling |
| 09 | Package Management & npm | Tooling |
| 10 | UX Design Fundamentals | UX Design |
| 11 | Accessibility | UX Design |
| 12 | Figma for Web | UX Design |
| 13 | Photoshop for Web | UX Design |
| 14 | Backend Considerations | Building Applications |
| 15 | PHP | Building Applications |
| 16 | React | Building Applications |
| 17 | API Design & REST | Building Applications |
| 18 | Security by Design | Production |
| 19 | Deployment | Production |
| 20 | Performance | Production |
| 21 | Architecture Blueprints | Production |
| 22 | Scaling Strategies | Senior Mindset |
| 23 | Junior vs Senior Thinking | Senior Mindset |
| 24 | Career & Communication | Senior Mindset |
| 25 | Project Overview | Capstone |
| 26 | Frontend Implementation | Capstone |
| 27 | Backend Implementation | Capstone |
| 28 | Final Considerations | Capstone |
| — | TypeScript Basics | Bonus |
| — | SVG Diagram Coordinates | Bonus |
| — | CI/CD Fundamentals | Bonus |
| — | Debugging Your Project | Bonus |
| — | Resources & Links | Reference |

## File Tree

```
textbook/
├── README.md
├── backend/
│   ├── cms-api/
│   │   ├── index.js
│   │   └── index.php
│   ├── contact-api/
│   │   ├── index.js
│   │   └── index.php
│   └── database/
│       ├── schema.sql
│       └── schema.sqlite.sql
├── project-walkthrough/
│   ├── backend/
│   │   └── contact.php
│   └── public/
│       ├── config.json
│       ├── css/
│       │   └── style.css
│       ├── index.html
│       └── js/
│           ├── app.js
│           ├── renderer.js
│           └── router.js
└── public/
    ├── 404.html
    ├── assets/
    │   ├── css/
    │   │   ├── components.css
    │   │   ├── main.css
    │   │   └── themes.css
    │   └── js/
    │       ├── navigation.js
    │       ├── search.js
    │       ├── sidebar.js
    │       └── themes.js
    ├── chapters/
    │   ├── 00-first-steps/
    │   │   ├── 01-how-the-web-works.html
    │   │   └── 02-browser-internals.html
    │   ├── 01-foundations/
    │   │   ├── 03-terminal-and-tools.html
    │   │   ├── 04-git-and-version-control.html
    │   │   └── 05-folder-structure-and-docs.html
    │   ├── 02-tooling/
    │   │   ├── 06-html.html
    │   │   ├── 07-css.html
    │   │   ├── 08-javascript.html
    │   │   └── 09-package-management.html
    │   ├── 03-ux-design/
    │   │   ├── 10-ux-design.html
    │   │   ├── 11-accessibility.html
    │   │   ├── 12-figma.html
    │   │   └── 13-photoshop-for-web.html
    │   ├── 04-building-applications/
    │   │   ├── 14-backend-considerations.html
    │   │   ├── 15-php.html
    │   │   ├── 16-react.html
    │   │   └── 17-api-design.html
    │   ├── 05-production/
    │   │   ├── 18-security-by-design.html
    │   │   ├── 19-deployment.html
    │   │   ├── 20-performance.html
    │   │   └── 21-architecture-blueprints.html
    │   ├── 06-senior-mindset/
    │   │   ├── 22-scaling-strategies.html
    │   │   ├── 23-junior-vs-senior.html
    │   │   └── 24-career.html
    │   ├── 07-capstone/
    │   │   ├── 25-project-overview.html
    │   │   ├── 26-frontend-implementation.html
    │   │   ├── 27-backend-implementation.html
    │   │   └── 28-final-considerations.html
    │   └── bonus/
    │       ├── bonus-cicd.html
    │       ├── bonus-debugging.html
    │       ├── bonus-svg-coordinates.html
    │       └── bonus-typescript.html
    ├── examples/
    │   ├── block-renderer-sandbox.html
    │   ├── formdata-vs-json.html
    │   ├── pagination-demo.html
    │   ├── router-explorer.html
    │   └── turnstile-lifecycle.html
    ├── index.html
    └── resources.html
```

## Features

- Clean textbook-style typography (serif body, warm reading experience)
- Dark/light mode toggle with localStorage persistence
- Print-optimized CSS
- Responsive layout (mobile sidebar, fluid typography)
- Table of contents injected via JavaScript (single source of truth in sidebar.js)
- Scroll-to-current-chapter in sidebar navigation
- Active chapter highlighting
- Decision trees, code blocks with copy buttons, junior vs senior comparisons
- "Why This Works" callouts throughout

## Deployment

The `public/` folder is a fully self-contained static site. Deploy it to:

- **GitHub Pages** — git-connected, auto-deploy, free HTTPS
- **Cloudflare Pages** — git-connected, auto-deploy, free HTTPS
- **Vercel** — zero-config static deploys
- **Netlify** — drag-and-drop or git-based
- Any static web server (Apache, Nginx, etc.)

For GitHub Pages, set the publish source to the `public` folder.

## License

Educational reference material.