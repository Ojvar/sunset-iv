"use strict";

const Path = require("path");

/**
 * Get entries list
 */
function getEntries() {
    return {
        "scripts/pages/main": "./src/frontend/scripts/pages/main.ts",
    };
}

module.exports = (env = {}) => ({
    mode: env.prod ? "production" : "development",
    devtool: env.prod ? "source-map" : "eval-cheap-module-source-map",

    entry: getEntries(),

    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: "ts-loader",
                include: [Path.resolve(__dirname, "src")],
            },
        ],
    },

    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json", ".html"],
        modules: [Path.resolve("./src"), Path.resolve("./node_modules")],
        alias: {
            "@": Path.resolve(__dirname, "src"),
        },
    },

    output: {
        path: Path.resolve(__dirname, "public"),
        filename: "[name].js",
    },

    devServer: {
        publicPath: "/",
        contentBase: [Path.join(__dirname, "public")],
        compress: true,
        port: 9595,
        // useLocalIp: true,
        inline: true,
        hot: true,
        stats: "minimal",
        overlay: true,
    },
});
