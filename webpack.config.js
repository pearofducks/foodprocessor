var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  devServer: {
    hot: true,
    inline: true,
    color: true,
    stats: 'errors-only',
    historyApiFallback: true
  },
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    sourceMapFilename: "bundle.js.map"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015','react','stage-1','react-hmre'],
        }
      },
    ]
  }
};
