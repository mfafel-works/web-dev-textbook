const tocData = [
  { type: 'section', label: 'First Steps' },
  { type: 'item', href: '/chapters/00-first-steps/01-how-the-web-works.html', label: '01 — How the Web Works' },
  { type: 'item', href: '/chapters/00-first-steps/02-browser-internals.html', label: '02 — How the Browser Works' },
  { type: 'part', label: 'Part 1: Foundations' },
  { type: 'item', href: '/chapters/01-foundations/03-terminal-and-tools.html', label: '03 — The Command Line &amp; Local Dev' },
  { type: 'item', href: '/chapters/01-foundations/04-git-and-version-control.html', label: '04 — Git &amp; Version Control' },
  { type: 'item', href: '/chapters/01-foundations/05-folder-structure-and-docs.html', label: '05 — Folder Structure &amp; Docs' },
  { type: 'part', label: 'Part 2: Tooling' },
  { type: 'item', href: '/chapters/02-tooling/06-html.html', label: '06 — HTML' },
  { type: 'item', href: '/chapters/02-tooling/07-css.html', label: '07 — CSS' },
  { type: 'item', href: '/chapters/02-tooling/08-javascript.html', label: '08 — JavaScript' },
  { type: 'item', href: '/chapters/02-tooling/09-package-management.html', label: '09 — Package Management &amp; npm' },
  { type: 'part', label: 'Part 3: UX Design' },
  { type: 'item', href: '/chapters/03-ux-design/10-ux-design.html', label: '10 — UX Design Fundamentals' },
  { type: 'item', href: '/chapters/03-ux-design/11-accessibility.html', label: '11 — Accessibility' },
  { type: 'item', href: '/chapters/03-ux-design/12-figma.html', label: '12 — Figma for Web' },
  { type: 'item', href: '/chapters/03-ux-design/13-photoshop-for-web.html', label: '13 — Photoshop for Web' },
  { type: 'part', label: 'Part 4: Building Applications' },
  { type: 'item', href: '/chapters/04-building-applications/14-backend-considerations.html', label: '14 — Backend Considerations' },
  { type: 'item', href: '/chapters/04-building-applications/15-php.html', label: '15 — PHP' },
  { type: 'item', href: '/chapters/04-building-applications/16-react.html', label: '16 — React' },
  { type: 'item', href: '/chapters/04-building-applications/17-api-design.html', label: '17 — API Design &amp; REST' },
  { type: 'part', label: 'Part 5: Production' },
  { type: 'item', href: '/chapters/05-production/18-security-by-design.html', label: '18 — Security by Design' },
  { type: 'item', href: '/chapters/05-production/19-deployment.html', label: '19 — Deployment' },
  { type: 'item', href: '/chapters/05-production/20-performance.html', label: '20 — Performance' },
  { type: 'item', href: '/chapters/05-production/21-architecture-blueprints.html', label: '21 — Architecture Blueprints' },
  { type: 'part', label: 'Part 6: The Senior Mindset' },
  { type: 'item', href: '/chapters/06-senior-mindset/22-scaling-strategies.html', label: '22 — Scaling Strategies' },
  { type: 'item', href: '/chapters/06-senior-mindset/23-junior-vs-senior.html', label: '23 — Junior vs Senior Thinking' },
  { type: 'item', href: '/chapters/06-senior-mindset/24-career.html', label: '24 — Career &amp; Communication' },
  { type: 'part', label: 'Part 7: Capstone' },
  { type: 'item', href: '/chapters/07-capstone/25-project-overview.html', label: '25 — Project Overview' },
  { type: 'item', href: '/chapters/07-capstone/26-frontend-implementation.html', label: '26 — Frontend Implementation' },
  { type: 'item', href: '/chapters/07-capstone/27-backend-implementation.html', label: '27 — Backend Implementation' },
  { type: 'item', href: '/chapters/07-capstone/28-final-considerations.html', label: '28 — Final Considerations' },
  { type: 'part', label: 'Bonus: Additional Skills' },
  { type: 'item', href: '/chapters/bonus/bonus-typescript.html', label: 'TypeScript Basics' },
  { type: 'item', href: '/chapters/bonus/bonus-svg-coordinates.html', label: 'SVG Diagram Coordinates' },
  { type: 'item', href: '/chapters/bonus/bonus-cicd.html', label: 'CI/CD Fundamentals' },
  { type: 'item', href: '/chapters/bonus/bonus-debugging.html', label: 'Debugging Your Project' },
  { type: 'part', label: 'Reference' },
  { type: 'item', href: '/resources.html', label: 'Resources &amp; Links' },
];

function renderSidebar() {
  const container = document.getElementById('sidebar-toc');
  if (!container) return;

  const currentPath = window.location.pathname;

  const html = `
    <div class="sidebar-heading">Contents</div>
    <ul class="toc-list">
      ${tocData.map(item => {
        if (item.type === 'part') {
          return `<li class="toc-part">${item.label}</li>`;
        }
        if (item.type === 'section') {
          return `<li class="toc-section">${item.label}</li>`;
        }
        const isActive = currentPath.endsWith(item.href);
        const activeClass = isActive ? ' active' : '';
        return `<li class="toc-item"><a href="${item.href}" class="${activeClass}">${item.label}</a></li>`;
      }).join('')}
    </ul>
  `;

  container.innerHTML = html;

  const activeLink = container.querySelector('.toc-item a.active');
  if (activeLink) {
    activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

document.addEventListener('DOMContentLoaded', renderSidebar);