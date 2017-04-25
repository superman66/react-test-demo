const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { NODE_ENV } = process.env;


const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: NODE_ENV === 'development'
});

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    'NODE_ENV': JSON.stringify(NODE_ENV)
  }),
  extractLess,
  new HtmlwebpackPlugin({
    title: 'react-test-demo',
    filename: 'index.html',
    template: 'src/index.html',
    inject: true,
    hash: true,
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.BannerPlugin({ banner: `Last update: ${new Date().toString()}` }));
}

const common = {
  entry: path.resolve(__dirname, 'src/'),
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'src'),
    publicPath: '/build'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build',
  },
  plugins,
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [
        'babel-loader'
      ],
      exclude: /node_modules/
    },
    {
      test: /\.less$/,
      loader: extractLess.extract({
        // use style-loader in development
        fallback: 'style-loader',
        use: [
          'css-loader',
          'less-loader'
        ],
      })
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        // use style-loader in development
        fallback: 'style-loader',
        use: [
          'css-loader',
        ],
      })
    },
    {
      test: /\.md$/,
      use: [{
        loader: 'html-loader'
      }, {
        loader: 'markdown-loader',
      }
      ]
    }, {
      test: /\.(woff|woff2|eot|ttf|svg)($|\?)/,
      use: [{
        loader: 'url-loader?limit=1&hash=sha512&digest=hex&size=16&name=resources/[hash].[ext]'
      }]

    }]
  }
};

module.exports = (env = {}) => {
  return Object.assign({}, common, {
    entry: [
      path.resolve(__dirname, 'src/index')
    ]
  });
};
