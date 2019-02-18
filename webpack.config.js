// webpack.config.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./app-client.js",
  output: {
    path: path.resolve(__dirname, './static'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  devtool: "cheap-source-map"
};