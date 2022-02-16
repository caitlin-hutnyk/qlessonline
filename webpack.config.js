const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(wav|mp3)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'sounds'
        }
      }
    ],
  },
  mode: 'development'
};