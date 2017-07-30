var webpack = require('webpack');

module.exports = {
	plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "game.min.js"
  }
}