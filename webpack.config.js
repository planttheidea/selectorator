'use strict';

const path = require('path');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  entry: [
    path.resolve(__dirname, 'src', 'index.js')
  ],

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: true,
    formatter: eslintFriendlyFormatter
  },

  module: {
    preLoaders: [
      {
        cacheable: true,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        cacheable: true,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel',
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'selectorator.js',
    library: 'selectorator',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new LodashModuleReplacementPlugin({
      paths: true
    })
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    fallback: [
      path.join(__dirname, 'src')
    ],

    root: __dirname
  }
};
