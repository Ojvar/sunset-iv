/*
    cp node_modules/laravel-mix/setup/webpack.mix.js ./
*/

"use strict";

let mix = require("laravel-mix");

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
if (mix.inProduction()) {
    mix.version();
} else {
    mix.sourceMaps(true);
    // mix.browserSync("https://locahost:8585");
    // mix.options({
    //     hmrOptions: {
    //         host: "https://localhost",
    //         port: 8585,
    //     },
    // });
}
// mix.autoload({
//     vue: ["Vue"],
//     vuex: ["Vuex"],
// });
// mix.setPublicPath("./dist/public");
// mix.disableSuccessNotifications();
// mix.options({
//     extractVueStyles: true,
//     globalVueStyles: true,
//     processCssUrls: true,
//     terser: {},
//     purifyCss: true,
//     postCss: [require("autoprefixer")],
//     clearConsole: false,
//     cssNano: {
//         // discardComments: {removeAll: true},
//     },
// });

/* TS/JS Scripts */
mix.js("./src/frontend/js/app/main.ts", "./dist/public/js/app");
