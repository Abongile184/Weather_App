// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // cleans dist on each build
  },

  devtool: "eval-source-map",

  devServer: {
  static: path.resolve(__dirname, "dist"),
  open: true,
  hot: true,
  watchFiles: ["src/**/*", "src/weatherUi.html"],
  proxy: [
    { //This change fixes the "options.proxy should be an array" error.
      context: ['/api'],
      target: 'http://localhost:3001',  //backend Express server
      changeOrigin: true,
      secure: false,
    }
  ],
},

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/weatherUi.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css", // generates a CSS file in dist
      linkType: "text/css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // extracts CSS to separate file
          "css-loader", // interprets @import and url()
          "postcss-loader", // enables Tailwind via PostCSS
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader" 
        }
    }
  ],
 },
};