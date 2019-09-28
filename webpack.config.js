const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const nodeExternals = require('webpack-node-externals');

const entryPath = path.resolve(__dirname, 'src', 'server');
const outPath = path.resolve(__dirname, 'dist', 'server');
module.exports = {
  entry: path.resolve(entryPath, 'index.js'),
  output: {
    path: outPath,
    filename: 'index.js',
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [
    nodeExternals(),
  ],
  optimization: {
    nodeEnv: false,
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: 'current',
                },
              }],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: entryPath,
        to: outPath,
        ignore: ['!schema.graphql'],
      },
    ]),
  ],
};
