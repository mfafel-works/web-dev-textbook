function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function resolvePage(path) {
  const key = CMS.routes[path];
  if (!key) return null;
  return CMS.pages[key];
}

function navigate() {
  const path = getRoute();
  const page = resolvePage(path);

  if (!page) {
    renderNotFound();
    buildNav();
    return;
  }

  renderPage(page);
  buildNav();
}
