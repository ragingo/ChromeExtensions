const path = require('path');

module.exports = {
  entry: {
    'app':[
      path.resolve(__dirname, './src/app.tsx')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'inline-soruce-map',
  module: {
    rules: [
      { test: /\.tsx?$/, enforce: 'pre', loader: 'tslint-loader' },
      { test: /\.tsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'], sideEffects: true }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
}
