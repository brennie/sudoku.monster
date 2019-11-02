/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const path = require("path");

const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlPlugin = require("script-ext-html-webpack-plugin");

const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "dist");

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

module.exports = {
  entry: path.resolve(srcPath, "index.tsx"),
  output: {
    filename: hashify("index.js"),
    path: distPath,
  },
  mode: nodeEnv,
  devtool: "source-map",
  resolve: {
    extensions: [".pcss", ".js", ".ts", ".tsx"],
    modules: ["node_modules"],
    alias: {
      "sudoku.monster": srcPath,
    },
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.pcss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProduction,
            },
          },
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[local]__[hash:base64:6]",
              },
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      inject: "head",
      title: "sudoku.monster",
      template: path.resolve(srcPath, "index.ejs"),
      filename: "index.html",
      minify: isProduction
        ? {
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            quoteCharacter: `"`,
          }
        : undefined,
    }),
    new ScriptExtHtmlPlugin({
      defaultAttribute: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: hashify("[name].css"),
      chunkFilename: hashify("[id].css"),
    }),
  ],
};

/**
 * Insert a hash into the filename in production mode.
 */
function hashify(filename) {
  if (!isProduction) {
    return filename;
  }

  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  return `${base}.[hash]${ext}`;
}
