// themes.js — Dark/Light mode toggle with localStorage persistence

(function () {
  const STORAGE_KEY = 'textbook-theme';
  const DEFAULT_THEME = 'light';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* storage unavailable */ }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggleBtns = document.querySelectorAll('[data-theme-toggle]');
    toggleBtns.forEach(function (btn) {
      const icon = theme === 'dark' ? '\u2600' : '\u263E';
      const label = theme === 'dark' ? 'Light' : 'Dark';
      btn.innerHTML = '<span class="icon">' + icon + '</span>' + label;
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  // Init
  var initial = getStoredTheme();
  applyTheme(initial);

  // Bind toggle buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (btn) toggleTheme();
  });

  // Expose for other scripts
  window.textbookTheme = { toggle: toggleTheme, get: function () { return document.documentElement.getAttribute('data-theme'); } };
})();
