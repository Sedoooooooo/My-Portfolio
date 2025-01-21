const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const hostname = '127.0.0.1';
const port = 3000;

const publicFolder = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  // Default to index.html for the root URL
  let filePath = path.join(publicFolder, req.url === '/' ? 'index.html' : req.url);

  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // MIME types 
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
  };

  // Default to plain text if no MIME type is found
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Read the file from the public folder
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If file not found, serve 404.html
        fs.readFile(path.join(publicFolder, '404.html'), (err, errorContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(errorContent || '404 Not Found', 'utf-8');
        });
      } else {
        // Some other server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Serve the file with the correct content type
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}); 

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
