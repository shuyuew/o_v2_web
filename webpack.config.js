const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  
  // Entry
  entry: {
    index: './src/app.js',
    others: [
      './src/components/ActiveBillers.jsx',
      './src/components/Beneficiaries.jsx',
      './src/components/Beneficiary.jsx',
      './src/components/BillersTitle.jsx',
      './src/components/BillListing.jsx',
      './src/components/BillPaymentStatus.jsx',
      './src/components/ChangePassword.jsx',
      './src/components/confirm.js',
      './src/components/Confirmation.jsx',
      './src/components/CurrenciesSelect.jsx',
      './src/components/Dashboard.jsx',
      './src/components/ExchangeRate.jsx',
      './src/components/ForgotPassword.jsx',
      './src/components/History.jsx',
      './src/components/HomeBackground.jsx',
      './src/components/HomepageInput.jsx',
      './src/components/HomepageRoute.jsx',
      './src/components/HomeTitle.jsx',
      './src/components/InputError.jsx',
      './src/components/Loader.jsx',
      './src/components/Login.jsx',
      './src/components/MainContent.jsx',
      './src/components/MethodOfCollection.jsx',
      './src/components/MyBillers.jsx',
      './src/components/MyCards.jsx',
      './src/components/MyProfile.jsx',
      './src/components/Navigation.jsx',
      './src/components/NewBeneficiary.jsx',
      './src/components/NewBiller.jsx',
      './src/components/NewCardForm.jsx',
      './src/components/NewCreditCard.jsx',
      './src/components/NotFound.jsx',
      './src/components/OffCanvas.jsx',
      './src/components/PayBills.jsx',
      './src/components/PayBillSuccess.jsx',
      './src/components/PaymentWizard.jsx',
      './src/components/PaymentSteps.jsx',
      './src/components/PhoneInput.jsx',
      './src/components/PrivateRoute.jsx',
      './src/components/Registration.jsx',
      './src/components/RegistrationSuccess.jsx',
      './src/components/ResetPassword.jsx',
      './src/components/ShareOrobo.jsx',
      './src/components/Sidebar.jsx',
      './src/components/Smiley.jsx',
      './src/components/StatusBar.jsx',
      './src/components/Welcome.jsx'
    ]
  },
  
  // Output
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js'
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
      // {
      //   test: /\.scss$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       { 'loader': 'css-loader', options: { sourceMap: true } },
      //       { 'loader': 'sass-loader', options: { sourceMap: true } }
      //     ]
      //   })
      // }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Orobo | Transferring Happiness Everyday!',
      template: 'src/index.hbs'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.HotModuleReplacementPlugin({}),
    // new ExtractTextPlugin('style.css'),
    // new UglifyJsPlugin({
    //   test: /\.js($|\?)/i,
    //   cache: true,
    //   sourceMap: true
    // })
  ]
  
}