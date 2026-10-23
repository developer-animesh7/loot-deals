const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const isPreview = req.url.includes('preview=1') || req.url.includes('noredirect=1');
  let pathname = decodeURI(req.url.split('?')[0]);
  if (pathname === '/' || pathname === '') pathname = '/index.html';

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });

    if (isPreview && ext === '.html') {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(
        'window.location.href = TELEGRAM_URL;',
        'console.log("[Preview mode] Redirection to Telegram simulated:", TELEGRAM_URL);'
      );
      return res.end(content);
    }

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Loot Deals server is running!`);
  console.log(`Local URL:   http://localhost:${PORT}/`);
  console.log(`Preview URL (no auto-redirect): http://localhost:${PORT}/?preview=1`);
});
