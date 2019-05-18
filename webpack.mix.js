const mix = require('laravel-mix');

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

mix.js('resources/js/app.js', 'public/js').extract([
   'vue',
   'vue-router',
   '@fortawesome/fontawesome-svg-core',
   '@fortawesome/free-solid-svg-icons',
   '@fortawesome/vue-fontawesome',
   '@tinymce/tinymce-vue',
   'ace-builds',
   'emoji-js',
   'katex',
   'marked',
   'mermaid',
   'prismjs',
   'tinymce',
   'turndown',
   'turndown-plugin-gfm'
]);
mix.sass('resources/sass/app.scss', 'public/css');
