"use strict";

const _ = require("lodash");
const Path = require("path");
const CommonConfig = require(Path.resolve(__dirname, "webpack.common"));

module.exports = (env = {}) => {
  const config = _.merge({}, CommonConfig(env), {
    mode: "production",
    devtool: "source-map",
  });

  return config;
};
