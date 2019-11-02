"use strict";

const path = require("path");

const srcPath = path.resolve(__dirname, "src");
const isProduction = process.env.NODE_ENV === "production";

const plugins = [
  require("postcss-import")({
    path: srcPath,
  }),
  require("postcss-preset-env"),
  require("postcss-nested"),
  require("postcss-simple-vars"),
];

if (isProduction) {
  plugins.push(require("cssnano"));
}

module.exports = {
  plugins,
};
