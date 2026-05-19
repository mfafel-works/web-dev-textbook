// search.js — Lightweight client-side full-text search
// Searches text content of all indexed sections on the page.

(function () {
  var searchInput = document.querySelector('[data-search-input]');
  var resultsContainer = document.querySelector('[data-search-results]');

  if (!searchInput || !resultsContainer) return;

  // Build search index from searchable elements
  var searchableElements = document.querySelectorAll('[data-searchable]');
  var index = [];
  searchableElements.forEach(function (el, i) {
    index.push({
      id: i,
      title: el.getAttribute('data-search-title') || el.textContent.trim().slice(0, 80),
      text: el.textContent.toLowerCase(),
      element: el
    });
  });

  function performSearch(query) {
    if (!query || query.length < 2) {
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      return;
    }

    var q = query.toLowerCase();
    var matches = index.filter(function (item) {
      return item.text.indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No results found.</p>';
      resultsContainer.style.display = 'block';
      return;
    }

    var html = '<p><strong>' + matches.length + '</strong> result(s) found:</p>';
    matches.forEach(function (match) {
      var snippet = match.element.textContent.trim().slice(0, 150);
      var idx = snippet.toLowerCase().indexOf(q);
      var before = idx > 20 ? '...' : '';
      var start = Math.max(0, idx - 40);
      var displayText = (start > 0 ? '...' : '') + snippet.slice(start, start + 160);

      html += '<div class="search-result-item">';
      html += '  <div class="result-title">' + escapeHtml(match.title) + '</div>';
      html += '  <div class="result-context">' + escapeHtml(displayText) + '</div>';
      html += '</div>';
    });
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  var debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      performSearch(searchInput.value);
    }, 250);
  });
})();
