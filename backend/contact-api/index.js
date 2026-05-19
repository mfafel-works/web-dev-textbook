/**
 * Contact form endpoint — Resend + Turnstile (Node.js)
 *
 * Usage:
 *   node contact.js
 *   POST http://localhost:3001/contact
 *
 * Requires env vars:
 *   TURNSTILE_SECRET_KEY
 *   RESEND_API_KEY
 */

const http = require('http');
const https = require('https');

const PORT = 3001;

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

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const body = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    // Copy Authorization header if present
    if (data._auth) {
      options.headers['Authorization'] = data._auth;
      delete data._auth;
    }

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.method !== 'POST' || req.url !== '/contact') {
    return sendJSON(res, 404, { error: 'Not found. POST /contact' });
  }

  try {
    const input = await parseBody(req);

    if (!input.name || !input.email || !input.message) {
      return sendJSON(res, 400, { error: 'All fields are required.' });
    }

    const name = input.name.trim();
    const email = input.email.trim();
    const message = input.message.trim();

    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      return sendJSON(res, 400, { error: 'Invalid email address.' });
    }

    // Verify Turnstile
    const turnstileResult = await postJSON(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: process.env.TURNSTILE_SECRET_KEY || 'YOUR_SECRET_KEY',
        response: input['cf-turnstile-response'] || '',
      }
    );

    if (turnstileResult.status !== 200 || !turnstileResult.body.success) {
      return sendJSON(res, 403, { error: 'Bot verification failed.' });
    }

    // Send via Resend
    const emailResult = await postJSON(
      'https://api.resend.com/emails',
      {
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['hello@example.com'],
        subject: 'New message from ' + name,
        replyTo: email,
        text: 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message,
        _auth: 'Bearer ' + (process.env.RESEND_API_KEY || 'YOUR_RESEND_API_KEY'),
      }
    );

    if (emailResult.status === 200) {
      return sendJSON(res, 200, { status: 'ok' });
    } else {
      return sendJSON(res, 500, { error: 'Failed to send message.' });
    }
  } catch (err) {
    return sendJSON(res, 400, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Contact API running at http://localhost:${PORT}/contact`);
});
