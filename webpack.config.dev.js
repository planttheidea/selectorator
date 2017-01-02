'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboard = require('webpack-dashboard/plugin');

const defaultConfig = require('./webpack.config');

const PORT = 3000;

module.exports = Object.assign({}, defaultConfig, {
  cache: true,

  devServer: {
    contentBase: './dist',
    host: 'localhost',
    inline: true,
    lazy: false,
    noInfo: false,
    quiet: false,
    port: PORT,
    stats: {
      colors: true,
      progress: true
    }
  },

  entry: [
    path.resolve(__dirname, 'DEV_ONLY', 'App.js')
  ],

  eslint: Object.assign({}, defaultConfig.eslint, {
    failOnWarning: false
  }),

  module: Object.assign({}, defaultConfig.module, {
    loaders: defaultConfig.module.loaders.map((loaderObject) => {
      if (loaderObject.loader !== 'babel') {
        return loaderObject;
      }

      return Object.assign({}, loaderObject, {
        include: loaderObject.include.concat([
          path.resolve(__dirname, 'DEV_ONLY')
        ])
      });
    })
  }),

  output: Object.assign({}, defaultConfig.output, {
    publicPath: `http://localhost:${PORT}/`
  }),

  plugins: defaultConfig.plugins.concat([
    new HtmlWebpackPlugin(),
    new WebpackDashboard({
      port: 3210
    })
  ])
});
