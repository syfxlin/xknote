require("dotenv").config();
const mix = require("laravel-mix");
const webpack = require("webpack");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .js("resources/js/app.js", "public/js")
  .extract([
    "vue",
    "vue-router",
    "lodash",
    "@fortawesome/fontawesome-svg-core",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/vue-fontawesome"
  ]);
mix.sass("resources/sass/app.scss", "public/css");

mix.webpackConfig({
  externals: {
    "ace-builds": "ace",
    marked: "marked",
    turndown: "TurndownService",
    "turndown-plugin-gfm": "turndownPluginGfm",
    prismjs: "Prism",
    "emoji-js": "EmojiConvertor",
    "tinymce/tinymce": "tinyMCE",
    mermaid: "mermaid",
    katex: "katex",
    "katex/dist/contrib/auto-render": "renderMathInElement",
    diff2html: "Diff2Html",
    zooming: "Zooming"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        JUDGE0API:
          "'" + (process.env.JUDGE0API || "https://run-code.lincdn.top") + "'",
        RUN_CODE_LANG_LIST:
          "'" +
          (process.env.RUN_CODE_LANG_LIST ||
            '{"c":1,"cpp":2,"bash":3,"csharp":4,"go":5,"java":6,"node":7,"php":8,"python":9,"python2":10,"ruby":11,"rust":12,"scala":13,"typescript":14}') +
          "'",
        INDEX_PAGE: "'" + (process.env.INDEX_PAGE || "welcome") + "'"
      }
    })
  ]
});
