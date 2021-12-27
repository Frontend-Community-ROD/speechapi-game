const https = require('https');
const fs = require('fs');
const path = require('path');
const express  = require('express');
const options = {
  key: fs.readFileSync(path.resolve('cert/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve('cert/localhost.pem')),
};

const app = express();
app.use('/', express.static(path.resolve('public')));


https.createServer(options, app).listen(3000, () => {
  console.log('Application running in port 3000');
});
