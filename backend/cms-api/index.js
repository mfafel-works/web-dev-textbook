/**
 * Minimal REST API for a config-driven CMS.
 *
 * Endpoints:
 *   GET    /api/pages          — list all pages
 *   GET    /api/pages/:key     — get a single page
 *   POST   /api/pages          — create a page
 *   PUT    /api/pages/:key     — update a page
 *   DELETE /api/pages/:key     — delete a page
 *
 * Data is stored in a JSON file (pages.json).
 * In production, replace with a database (see /backend/database/).
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'pages.json');

function readPages() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function writePages(pages) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(pages, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathParts = url.pathname.replace('/api/pages', '').split('/').filter(Boolean);
  const key = pathParts[0] || null;
  const pages = readPages();

  try {
    switch (req.method) {
      case 'GET': {
        if (key) {
          if (!pages[key]) return sendJSON(res, 404, { error: 'Page not found' });
          return sendJSON(res, 200, pages[key]);
        }
        return sendJSON(res, 200, Object.keys(pages));
      }

      case 'POST': {
        const input = await parseBody(req);
        if (!input || !input.key || !input.data) {
          return sendJSON(res, 400, { error: 'Missing required fields: key, data' });
        }
        if (pages[input.key]) {
          return sendJSON(res, 409, { error: 'Page already exists' });
        }
        pages[input.key] = input.data;
        writePages(pages);
        return sendJSON(res, 201, { status: 'created', key: input.key });
      }

      case 'PUT': {
        if (!key) return sendJSON(res, 400, { error: 'Page key required in URL' });
        if (!pages[key]) return sendJSON(res, 404, { error: 'Page not found' });
        const input = await parseBody(req);
        pages[key] = input;
        writePages(pages);
        return sendJSON(res, 200, { status: 'updated', key });
      }

      case 'DELETE': {
        if (!key) return sendJSON(res, 400, { error: 'Page key required in URL' });
        if (!pages[key]) return sendJSON(res, 404, { error: 'Page not found' });
        delete pages[key];
        writePages(pages);
        return sendJSON(res, 200, { status: 'deleted', key });
      }

      default:
        return sendJSON(res, 405, { error: 'Method not allowed' });
    }
  } catch (err) {
    return sendJSON(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`CMS API running at http://localhost:${PORT}/api/pages`);
});
