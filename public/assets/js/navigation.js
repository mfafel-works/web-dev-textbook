// navigation.js — Sidebar TOC, active chapter, mobile toggle

(function () {
  // Mobile sidebar toggle
  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('[data-sidebar-toggle]');
    if (toggleBtn) {
      var sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    }

    // Close sidebar when clicking outside on mobile
    var sidebar = document.querySelector('.sidebar');
    var isOpen = sidebar && sidebar.classList.contains('open');
    if (isOpen && !e.target.closest('.sidebar') && !e.target.closest('[data-sidebar-toggle]')) {
      sidebar.classList.remove('open');
    }

    // Back to top button click
    var backToTop = e.target.closest('.back-to-top');
    if (backToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Highlight active chapter in sidebar
  function setActiveChapter() {
    var currentPath = window.location.pathname;
    var currentFile = currentPath.split('/').pop();
    var tocLinks = document.querySelectorAll('.toc-item a');
    tocLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var linkFile = href ? href.split('/').pop() : '';
      if (currentFile === linkFile) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Create and inject back-to-top button
  function createBackToTopButton() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }

  setActiveChapter();
  createBackToTopButton();
})();
