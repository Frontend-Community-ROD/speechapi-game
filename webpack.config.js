const path = require('path');
console.log('resolve', path.resolve(__dirname, 'public'));
module.exports = {
  target: 'web',
  entry: './src/front/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  }
}
