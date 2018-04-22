const path = require('path');
// const LiveReloadPlugin = require('webpack-livereload-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: ['./app/index.js', './stylesheets/index.scss'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  context: __dirname,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      options: {
        presets: ['react', 'env']
      }
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
    }
    ]
  },
  plugins: [
    // new LiveReloadPlugin({ appendScriptTag: true }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    })
  ]
};
