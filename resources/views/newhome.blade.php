<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre-exp.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre-icons.min.css">
        <title>XK-Note</title>
    </head>
    <body>
        <div id="app">
            <router-view></router-view>
        </div>
        <!-- Vue -->
        {{-- <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vue-router@3.0.6/dist/vue-router.min.js"></script> --}}
        <!-- ACE Editor -->
        <script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/ace.min.js"></script>
        <!-- Prism.js -->
        <script src="/static/prism.js"></script>
        <link rel="stylesheet" href="/static/prism-okaidia.css">
        <link rel="stylesheet" href="/static/prism-line-numbers.css">
        <link rel="stylesheet" href="/static/prism-toolbar.css">
        <link rel="stylesheet" href="/static/prism-copy-to-clipboard.min.css">
        <!-- Katex -->
        <script src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/contrib/auto-render.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css">
        <!-- Mermaid -->
        <script src="https://cdn.jsdelivr.net/npm/mermaid@8.0.0/dist/mermaid.min.js"></script>
        <!-- Emoji-js -->
        <script src="https://cdn.jsdelivr.net/npm/emoji-js@3.4.1/lib/emoji.min.js"></script>
        <!-- TinyMCE -->
        <script src="https://cdn.jsdelivr.net/npm/tinymce@5.0.5/tinymce.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/tinymce@5.0.5/themes/silver/theme.min.js"></script>
        <script src="https://cdn.jsdelivr.net/combine/npm/tinymce@5.0.5/plugins/print/plugin.min.js,npm/tinymce@5.0.5/plugins/preview/plugin.min.js,npm/tinymce@5.0.5/plugins/fullpage/plugin.min.js,npm/tinymce@5.0.5/plugins/fullscreen/plugin.min.js,npm/tinymce@5.0.5/plugins/searchreplace/plugin.min.js,npm/tinymce@5.0.5/plugins/autolink/plugin.min.js,npm/tinymce@5.0.5/plugins/directionality/plugin.min.js,npm/tinymce@5.0.5/plugins/code/plugin.min.js,npm/tinymce@5.0.5/plugins/visualblocks/plugin.min.js,npm/tinymce@5.0.5/plugins/visualchars/plugin.min.js,npm/tinymce@5.0.5/plugins/image/plugin.min.js,npm/tinymce@5.0.5/plugins/link/plugin.min.js,npm/tinymce@5.0.5/plugins/media/plugin.min.js,npm/tinymce@5.0.5/plugins/template/plugin.min.js,npm/tinymce@5.0.5/plugins/codesample/plugin.min.js,npm/tinymce@5.0.5/plugins/table/plugin.min.js,npm/tinymce@5.0.5/plugins/charmap/plugin.min.js,npm/tinymce@5.0.5/plugins/hr/plugin.min.js,npm/tinymce@5.0.5/plugins/pagebreak/plugin.min.js,npm/tinymce@5.0.5/plugins/nonbreaking/plugin.min.js,npm/tinymce@5.0.5/plugins/anchor/plugin.min.js,npm/tinymce@5.0.5/plugins/toc/plugin.min.js,npm/tinymce@5.0.5/plugins/insertdatetime/plugin.min.js,npm/tinymce@5.0.5/plugins/advlist/plugin.min.js,npm/tinymce@5.0.5/plugins/lists/plugin.min.js,npm/tinymce@5.0.5/plugins/wordcount/plugin.min.js,npm/tinymce@5.0.5/plugins/imagetools/plugin.min.js,npm/tinymce@5.0.5/plugins/textpattern/plugin.min.js"></script>
        <script src="/js/manifest.js"></script>
        <script src="/js/vendor.js"></script>
        <script src="/js/app.js"></script>
    </body>
</html>
