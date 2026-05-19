function renderPage(page) {
  const html = page.blocks.map(renderBlock).join('');
  document.getElementById('app').innerHTML =
    '<h1>' + escapeHtml(page.title) + '</h1>' + html;
  document.title = page.title + ' \u2014 ' + CMS.site.title;

  if (page.blocks.some(b => b.type === 'contact-form')) {
    setupContactForm();
  }
}

function renderBlock(block) {
  switch (block.type) {
    case 'hero':
      return '<section class="hero">' +
        '<h2>' + escapeHtml(block.text) + '</h2>' +
        '</section>';

    case 'text':
      return '<section class="text-block">' +
        '<p>' + escapeHtml(block.content) + '</p>' +
        '</section>';

    case 'image':
      return '<figure>' +
        '<img src="' + escapeAttr(block.src) + '" alt="' + escapeAttr(block.alt) + '">' +
        '</figure>';

    case 'contact-form':
      return '<form id="contact-form" class="contact-form">' +
        '<label for="name">Name</label>' +
        '<input type="text" id="name" name="name" required>' +

        '<label for="email">Email</label>' +
        '<input type="email" id="email" name="email" required>' +

        '<label for="message">Message</label>' +
        '<textarea id="message" name="message" required></textarea>' +

        '<div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>' +

        '<button type="submit">Send</button>' +
        '<div id="form-status"></div>' +
        '</form>';

    case 'paginated-list':
      return renderPaginatedList(block);

    default:
      return '<p>Unknown block type: ' + escapeHtml(block.type) + '</p>';
  }
}

function renderPaginatedList(block) {
  const page = block._page || 1;
  const perPage = block.perPage || 10;
  const totalPages = Math.ceil(block.items.length / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = block.items.slice(start, end);
  const blockKey = block._key || Math.random().toString(36).slice(2, 9);

  if (!block._key) block._key = blockKey;

  let html = '<div class="paginated-list" data-block="' + blockKey + '">';

  html += '<div class="paginated-items">';
  for (const item of pageItems) {
    html += '<article class="paginated-item">';
    html += '<h3>' + escapeHtml(item.title) + '</h3>';
    html += '<time>' + escapeHtml(item.date) + '</time>';
    html += '<p>' + escapeHtml(item.summary) + '</p>';
    html += '</article>';
  }
  html += '</div>';

  html += '<nav class="pagination" aria-label="Pagination">';
  html += buildPagination(totalPages, page, blockKey);
  html += '</nav>';

  html += '</div>';
  return html;
}

function buildPagination(totalPages, currentPage, blockKey) {
  if (totalPages <= 1) return '';

  const windowSize = 3;
  let pages = [];

  pages.push(1);

  let windowStart = Math.max(2, currentPage - windowSize);
  let windowEnd = Math.min(totalPages - 1, currentPage + windowSize);

  if (windowEnd - windowStart < windowSize * 2) {
    if (currentPage < totalPages / 2) {
      windowEnd = Math.min(totalPages - 1, windowStart + windowSize * 2);
    } else {
      windowStart = Math.max(2, windowEnd - windowSize * 2);
    }
  }

  if (windowStart > 2) {
    pages.push('...');
  }

  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i);
  }

  if (windowEnd < totalPages - 1) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  let html = '';
  for (const p of pages) {
    if (p === '...') {
      html += '<span class="pagination-ellipsis">&hellip;</span>';
    } else if (p === currentPage) {
      html += '<span class="pagination-current" aria-current="page">' + p + '</span>';
    } else {
      html += '<button class="pagination-page" data-page="' + p + '" data-block="' + blockKey + '">' + p + '</button>';
    }
  }

  return html;
}

function renderNotFound() {
  document.getElementById('app').innerHTML =
    '<h1>404</h1>' +
    '<p>Page not found.</p>' +
    '<a href="#/">Go home</a>';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
