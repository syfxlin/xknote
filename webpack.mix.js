const mix = require("laravel-mix");

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
    "katex/dist/contrib/auto-render": "renderMathInElement"
  }
});
