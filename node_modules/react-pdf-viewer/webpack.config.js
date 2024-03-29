const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    'main': './scripts/main.js',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
}
