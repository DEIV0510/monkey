// Servidor local de desarrollo. Aplica los mismos encabezados de vercel.json
// para detectar en local cualquier bloqueo de la política de seguridad.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 5313;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const rules = (JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')).headers || []).map((rule) => ({
  test: new RegExp('^' + rule.source.replace(/\//g, '\\/') + '$'),
  headers: rule.headers,
}));

function headersFor(urlPath) {
  const out = {};
  rules.forEach((rule) => {
    if (rule.test.test(urlPath)) rule.headers.forEach((h) => { out[h.key] = h.value; });
  });
  return out;
}

http.createServer(function (req, res) {
  var urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  var filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }

  fs.readFile(filePath, function (err, data) {
    var headers = headersFor(urlPath);
    if (err) {
      var notFound = fs.readFileSync(path.join(ROOT, '404.html'));
      res.writeHead(404, Object.assign({ 'Content-Type': TYPES['.html'] }, headersFor('/404.html')));
      return res.end(notFound);
    }
    var ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, Object.assign({ 'Content-Type': TYPES[ext] || 'application/octet-stream' }, headers));
    res.end(data);
  });
}).listen(PORT, function () {
  console.log('Monkey Grip dev server running at http://localhost:' + PORT + '/');
});
