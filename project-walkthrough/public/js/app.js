let CMS;

async function init() {
  const res = await fetch('config.json');
  CMS = await res.json();

  navigate();
}

function buildNav() {
  const currentPath = getRoute();
  const nav = document.getElementById('nav');
  nav.innerHTML = Object.entries(CMS.routes).map(([path, key]) => {
    const active = path === currentPath ? ' class="active"' : '';
    return '<a href="#' + path + '"' + active + '>' + escapeHtml(CMS.pages[key].title) + '</a>';
  }).join('');
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      message: formData.get('message').trim()
    };

    if (!data.name || !data.email || !data.message) {
      showFormStatus('All fields are required.', 'error');
      return;
    }
    if (!data.email.includes('@')) {
      showFormStatus('Please enter a valid email.', 'error');
      return;
    }

    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch(data.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Server error');
      showFormStatus('Message sent!', 'success');
      form.reset();
    } catch (err) {
      showFormStatus('Something went wrong. Try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  });
}

function showFormStatus(msg, type) {
  const el = document.getElementById('form-status');
  if (el) { el.textContent = msg; el.className = type; }
}

function findBlockByKey(key) {
  for (const pageKey in CMS.pages) {
    const page = CMS.pages[pageKey];
    for (const block of page.blocks) {
      if (block._key === key) return block;
    }
  }
  return null;
}

document.addEventListener('click', function(e) {
  const btn = e.target.closest('.pagination-page');
  if (!btn) return;

  const page = parseInt(btn.dataset.page);
  const blockKey = btn.dataset.block;
  const block = findBlockByKey(blockKey);

  if (!block) return;

  block._page = page;
  const container = document.querySelector('[data-block="' + blockKey + '"]');
  if (container) {
    container.outerHTML = renderPaginatedList(block);
  }
});

window.addEventListener('hashchange', navigate);

init();
