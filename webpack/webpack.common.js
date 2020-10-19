"use strict";

const Path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackLaravelMixManifest } = require("webpack-laravel-mix-manifest");
const { VueLoaderPlugin } = require("vue-loader");
const SuppressChunksPlugin = require("suppress-chunks-webpack-plugin").default;

const Entries = require(Path.resolve(__dirname, "entries"));

/**
 * Exports
 * @param {object} env
 */
module.exports = (env = {}) => ({
  entry: getEntries(Entries),
  output: getOutput(),
  module: getModule(),
  plugins: getPlugins(Entries),
  resolve: getResolve(),
  devServer: getDevServer(),
});

/**
 * Get output
 */
function getOutput() {
  return {
    path: Path.resolve("public"),
    publicPath: "/",
    filename: "[name].js",
  };
}

/**
 *
 * @param {object} entries
 */
function getEntries(entries) {
  return { ...entries.scripts, ...entries.styles };
}

/**
 * Get suppressed items list
 * @param {object} entries
 */
function getSupressList(entries) {
  const filters = Object.keys(entries || {}).map((x) => ({
    name: x,
    match: /\.js$/,
  }));

  return filters;
}

/**
 * Get modules list
 */
function getModule() {
  return {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?/,
        use: "ts-loader",
        include: [Path.resolve("src")],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              filename: "[name].css",
              publicPath: "./",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  };
}

/**
 * Get plugins list
 */
function getPlugins(entries) {
  const supressList = getSupressList(entries.styles);

  const list = [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new SuppressChunksPlugin(supressList),
    // new WebpackLaravelMixManifest(),
  ];

  return list;
}

/**
 * Get resolve items
 */
function getResolve() {
  return {
    extensions: [
      ".js",
      "*.jsx",
      ".tsx",
      ".ts",
      ".scss",
      ".css",
      ".json",
      "*.pug",
      ".html",
    ],
    modules: ["src", "node_modules"],
    alias: {
      "@": Path.resolve("src"),
    },
  };
}

/**
 * Get dev-server options
 */
function getDevServer() {
  return {
    publicPath: "/",
    contentBase: [Path.resolve("public")],
    compress: true,
    port: 8586,
    // useLocalIp: true,
    inline: true,
    hot: true,
    stats: "minimal",
    overlay: true,
  };
}
