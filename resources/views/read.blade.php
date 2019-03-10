<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>XK-Note</title>
    <link rel="stylesheet" href="editor.md/css/editormd.preview.css" />
    <link rel="stylesheet" href="css/style.preview.css">
    <link href="css/zui.min.css" rel="stylesheet">
</head>
<body>
    <div class="col-md-9">
        <div id="header">
            <h1 id="header-title" class="col-md-12"></h1>
            <div id="header-bottom"></div>
        </div>
        <div id="editormd-view">
            <textarea style="display:none;" name="editormd-markdown-doc">###Hello world!</textarea>
        </div>
    </div>
    <div class="col-md-3" id="sidebar">
        <ul class="nav nav-secondary nav-justified" style="margin-bottom:10px" id="menu-select">
            <li class="active"><a href="javascript:void(0);" onclick="xknote_view.menu_selected(this)" id="select-toc-container-view">大纲</a></li>
            <li><a href="javascript:void(0);" onclick="xknote_view.menu_selected(this)" id="select-menu-notes">文件夹</a></li>
        </ul>
        <div class="markdown-body editormd-preview-container" id="toc-container-view"></div>
        <nav class="menu hide" data-ride="menu" id="menu-notes">
            <ul id="treeMenu" class="tree tree-menu" data-ride="tree" data-animate="true" style="height:calc(100vh - 80px);overflow:auto">
                {!! $directory_parent !!}
            </ul>
        </nav>
    </div>
    <div id="m_menu"><i class="icon icon-bars"></i></div>
    <script src="js/jquery.min.js"></script>
    <script src="editor.md/editormd.min.js"></script>
    <script src="editor.md/lib/marked.min.js"></script>
    <script src="editor.md/lib/prettify.min.js"></script>
    <script src="editor.md/lib/raphael.min.js"></script>
    <script src="editor.md/lib/underscore.min.js"></script>
    <script src="editor.md/lib/sequence-diagram.min.js"></script>
    <script src="editor.md/lib/flowchart.min.js"></script>
    <script src="editor.md/lib/jquery.flowchart.min.js"></script>
    <script src="js/zui.min.js"></script>
    <script src="js/main.preview.js"></script>
    <script>
        xknote_view.start();
    </script>
</body>
</html>