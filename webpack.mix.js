/*
    cp node_modules/laravel-mix/setup/webpack.mix.js ./
*/

"use strict";

const Path = require("path");
const mix = require("laravel-mix");
require("laravel-mix-alias");

/* Define aliases */
mix.alias({
    "@public": "public",
    "@": "src/frontend",
    "@js": "src/frontend/js",
    "@sass": "src/frontend/sass",
    "@fonts": "src/frontend/fonts",
    "@images": "src/frontend/images",
    "@views": "views",
});

/* Configuration */
mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: { appendTsSuffixTo: [/\.vue$/] },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts", ".json", ".html", ".vue"],
        modules: [Path.resolve("./src"), Path.resolve("./node_modules")],
    },
});

/* Prepare */
mix.setPublicPath("public");

if (!mix.inProduction()) {
    mix.sourceMaps(true);
}
mix.version();

/* TS/JS Scripts */
mix.js("./src/frontend/scripts/core/app.ts", "js/core");
mix.js("./src/frontend/scripts/pages/main.ts", "js/pages");

/* SASS/CSS */
mix.sass("./src/frontend/sass/core/app.scss", "css/core");
