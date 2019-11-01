"use strict";

const isProduction = process.env.NODE_ENV === "production";

const plugins = [
  require("postcss-import"),
  require("autoprefixer"),
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
