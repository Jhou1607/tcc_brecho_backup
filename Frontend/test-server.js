   const http = require('http');
   http.createServer((req, res) => res.end('ok')).listen(4200, () => console.log('ok'));