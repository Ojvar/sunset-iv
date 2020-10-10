/*
    cp node_modules/laravel-mix/setup/webpack.mix.js ./
*/

"use strict";

let mix = require("laravel-mix");
require("laravel-mix-alias");

/* Define aliases */
mix.alias({
    "@public": "public",
    "@": "src/frontend",
    "@js": "src/frontend/js",
    "@sass": "src/frontend/sass",
    "@fonts": "src/frontend/fonts",
    "@images": "src/frontend/images",
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
        extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"],
    },
});

/* Prepare */
mix.setPublicPath("public");

if (mix.inProduction()) {
    mix.version();
} else {
    mix.sourceMaps(true);
}

/* TS/JS Scripts */
mix.js("./src/frontend/scripts/core/app.ts", "js/app");
mix.js("./src/frontend/scripts/pages/main.ts", "js/pages");

/* SASS/CSS */
mix.sass("./src/frontend/sass/core/app.scss", "css/core");
