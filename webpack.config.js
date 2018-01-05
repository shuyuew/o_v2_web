const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  
  // Entry
  entry: './src/app.js',
  
  // Output
  output: {
    path: path.resolve('dist'),
    filename: 'app-bundle.js'
  },
  
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './src',
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    stats: 'errors-only'
  },
  
  watch: true,
  watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  
  module: {
    loaders: [
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      { test: /\.hbs$/, loader: "handlebars-loader" },
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.html$/, loader: 'html-loader'},
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { 'loader': 'css-loader', options: { sourceMap: true } },
          { 'loader': 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Orobo Web App',
      template: 'src/index.hbs'
    }),
    new webpack.HotModuleReplacementPlugin({})
  ]
  
}