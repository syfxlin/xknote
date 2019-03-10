@extends('layouts.page')

@section('title', 'XK-Note后台')

@section('nav-item')
    <li>
        <div class="btn-group">
            <button type="button" class="btn btn-primary nav-botton" data-toggle="modal" data-target="#new-note-panel" id="new-note">新建MD笔记</button>
            <div class="btn-group">
                <button type="button" class="btn btn-primary nav-botton dropdown-toggle" data-toggle="dropdown">
                    <span class="caret"></span>
                    <span class="sr-only">新建MD笔记</span>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li><a href="#" data-toggle="modal" data-target="#new-folder-panel" id="new-folder">新建文件夹</a></li>
                </ul>
        </div>
    </li>
    <li><a href="javascript:xknote.write_mode();">写作模式</a></li>
    <li><a href="javascript:xknote.read_mode();">阅读模式</a></li>
    <li><a href="#" data-toggle="modal" data-target="#user-panel">个人中心</a></li>
@endsection

@section('user-nav')
    <li><a href="#" data-toggle="modal" data-target="#setting-panel" id="setting-panel-button">用户设置</a></li>
    <li><a href="#" data-toggle="modal" data-target="#git-panel" id="git-panel-button">Git设置</a></li>
    @if ($user_id == 1)
        <li><a href="#" data-toggle="modal" data-target="#system-panel" id="system-panel-button">系统管理</a></li>
    @endif
@endsection

@section('content')
    <div class="row">
        <div class="col-md-2" id="sidebar">
            <ul class="nav nav-secondary nav-justified" style="margin-bottom:10px" id="menu-select">
                <li class="active"><a href="#" onclick="xknote.menu_selected(this)" id="select-menu-notes">文件夹</a></li>
                <li><a href="#" onclick="xknote.menu_selected(this)" id="select-note-directory">大纲</a></li>
            </ul>
            <nav class="menu" data-ride="menu" id="menu-notes">
                <ul id="treeMenu" class="tree tree-menu" data-ride="tree" data-animate="true" style="height:calc(100vh - 160px);overflow:auto">
                    {!! $directory_parent !!}
                </ul>
            </nav>
            <div class="list-group hide" id="note-directory" style="height:calc(100vh - 160px);overflow:auto">
                <div class="markdown-body editormd-preview-container" id="toc-container" previewcontainer="true"></div>
            </div>
            <div id="copyright" class="col-md-2">© XK-Note By <a href="https://ixk.me">Otstar Lin</a></div>
        </div>
        <div class="col-md-10" style="padding:0px">
            <div id="note-nav">
                <input type="text" name="note_title" id="note-title" class="col-md-3">
                <div id="note-btns">
                    <div class="note-tip btn" id="note-operate">操作 <span class="caret"></span></div>
                    <div class="note-tip btn note-operate-item" id="note-save">云端保存</div>
                    <div class="note-tip btn note-operate-item" id="note-save-loc" title="注意该功能仅供临时保存使用，二次刷新会清除本地的数据">本地保存</div>
                    <div class="dropdown" style="display:inline-block">
                        <button type="button" class="btn dropdown-toggle note-tip note-operate-item" data-toggle="dropdown">下载 <span class="caret"></span></button>
                        <ul class="dropdown-menu pull-right" role="menu">
                            <li><a href="#" onclick="xknote.note_download(Editor.getMarkdown(),'md');">导出MD文件</a></li>
                            <li><a href="#" onclick="xknote.note_download(Editor.getHTML(),'html');">导出HTML文件</a></li>
                            <li><a href="#" onclick="xknote.note_download_full(Editor.getHTML());" title="使用此功能请确保网络正常">导出带样式的HTML</a></li>
                        </ul>
                    </div>
                    <div class="dropdown" style="display:inline-block">
                        <button type="button" class="btn dropdown-toggle note-tip note-operate-item" data-toggle="dropdown">信息 <span class="caret"></span></button>
                        <ul class="dropdown-menu pull-right" role="menu" id="note-info">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div class="dropdown" style="display:inline-block">
                        <button type="button" class="btn dropdown-toggle note-tip note-operate-item" data-toggle="dropdown" title="使用Git操作前请先将笔记保存至云端">Git <span class="caret"></span></button>
                        <ul class="dropdown-menu pull-right" role="menu" id="git-operate">
                            <li><a href="#" onclick="xknote.git_operate('push')">Push</a></li>
                            <li><a href="#" onclick="xknote.git_operate('pull')">Pull</a></li>
                            <li><a href="#" onclick="xknote.git_operate('clone')">Clone</a></li>
                            <li><a href="#" onclick="xknote.git_operate('create')">Create</a></li>
                            <li><a href="#" onclick="xknote.git_operate('push_force')">Push force</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="editormd">
                <textarea style="display:none;" id="note-content"></textarea>
            </div>
        </div>
    </div>
    <!-- 初始隐藏的资源 -->
    <div id="m_menu"><i class="icon icon-bars"></i></div>
    <!-- 写作模式 -->
    <div id="fixed-background"><a id="to-nomal-mode" href="javascript:xknote.nomal_mode();">普通模式</a></div>
    <div id="fixed-background-read"><a id="to-nomal-mode" href="javascript:xknote.nomal_mode();">普通模式</a></div>
    <!-- 新建笔记对话框 -->
    <div class="modal fade" id="new-note-panel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h4 class="modal-title">新建MD笔记</h4>
                </div>
                <div class="modal-body">
                    <div id="new-note-info">
                        <div class="form-group">
                            <label>文档名</label>
                            <input type="text" class="form-control" id="new-note-file">
                        </div>
                        <div class="form-group">
                            <label>标题</label>
                            <input type="text" class="form-control" id="new-note-title">
                        </div>
                        <div class="form-group">
                            <label>存放的文件夹</label>
                            <select class="form-control" id="new-note-select"></select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="new-note-save" data-dismiss="modal">新建</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 新建文件夹对话框 -->
    <div class="modal fade" id="new-folder-panel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h4 class="modal-title">新建文件夹</h4>
                </div>
                <div class="modal-body">
                    <div id="new-folder-info">
                        <div class="form-group">
                            <label>文件夹名</label>
                            <input type="text" class="form-control" id="new-folder-file">
                        </div>
                        <div class="form-group">
                            <label>存放的文件夹</label>
                            <select class="form-control" id="new-folder-select"></select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="new-folder-save" data-dismiss="modal">新建</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 个人中心 -->
    <div class="modal fade" id="user-panel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h4 class="modal-title">个人中心</h4>
                </div>
                <div class="modal-body">
                    <form id="user-form">
                        <div class="form-group">
                            <label>用户名</label>
                            <input type="text" name="user_name" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>邮箱</label>
                            <input type="email" name="user_email" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>旧密码</label>
                            <input type="password" name="old_password" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>新密码</label>
                            <input type="password" name="new_password" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>确认密码</label>
                            <input type="password" name="confirm_password" class="form-control">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="user-save">保存</button>
                </div>
            </div>
        </div>
    </div>
    <!-- 用户设置 -->
    <div class="modal fade" id="setting-panel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h4 class="modal-title">用户设置</h4>
                </div>
                <div class="modal-body">
                    <form id="setting-form">
                    <div class="form-group">
                        <label>Editor.md主题</label>
                        <select name="theme" class="form-control">
                            <option value="default" selected="selected">default</option>
                            <option value="dark">dark</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>预览界面主题</label>
                        <select name="previewTheme" class="form-control">
                            <option value="default" selected="selected">default</option>
                            <option value="dark">dark</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>编辑器主题</label>
                        <select name="editorTheme" class="form-control">
                            <option value="default">default</option>
                            <option value="3024-day">3024-day</option>
                            <option value="3024-night">3024-night</option>
                            <option value="ambiance">ambiance</option>
                            <option value="ambiance-mobile">ambiance-mobile</option>
                            <option value="base16-dark">base16-dark</option>
                            <option value="base16-light">base16-light</option>
                            <option value="blackboard">blackboard</option>
                            <option value="cobalt">cobalt</option>
                            <option value="eclipse">eclipse</option>
                            <option value="elegant">elegant</option>
                            <option value="erlang-dark">erlang-dark</option>
                            <option value="lesser-dark">lesser-dark</option>
                            <option value="mbo">mbo</option>
                            <option value="mdn-like">mdn-like</option>
                            <option value="midnight">midnight</option>
                            <option value="monokai">monokai</option>
                            <option value="neat">neat</option>
                            <option value="neo">neo</option>
                            <option value="night">night</option>
                            <option value="paraiso-dark">paraiso-dark</option>
                            <option value="paraiso-light">paraiso-light</option>
                            <option value="pastel-on-dark">pastel-on-dark</option>
                            <option value="rubyblue">rubyblue</option>
                            <option value="solarized" selected="selected">solarized</option>
                            <option value="the-matrix">the-matrix</option>
                            <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
                            <option value="twilight">twilight</option>
                            <option value="vibrant-ink">vibrant-ink</option>
                            <option value="xq-dark">xq-dark</option>
                            <option value="xq-light">xq-light</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>TOCM目录树</label>
                        <select name="tocm" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>图片上传</label>
                        <select name="imageUpload" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>解析HTML标签</label>
                        <input class="form-control" id="html-decode" type="text" value="true">
                    </div>
                    <div class="form-group">
                        <label>表情</label>
                        <select name="emoji" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>待办列表</label>
                        <select name="taskList" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>TEX公式</label>
                        <select name="tex" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>流程图</label>
                        <select name="flowChart" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>时序图</label>
                        <select name="sequenceDiagram" class="form-control">
                            <option value="1">True</option>
                            <option value="0">False</option>
                        </select>
                    </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="setting-save" data-dismiss="modal">保存</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Git设置 -->
    <div class="modal fade" id="git-panel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h4 class="modal-title">Git设置</h4>
                </div>
                <div class="modal-body">
                    <form id="git-form">
                        <div class="form-group">
                            <label>Git用户名</label>
                            <input type="text" name="git_name" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Git密码</label>
                            <input type="password" name="git_password" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Git邮箱</label>
                            <input type="email" name="git_email" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Git地址</label>
                            <input type="url" name="git_url" class="form-control">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="git-save" data-dismiss="modal">保存</button>
                </div>
            </div>
        </div>
    </div>
    @if ($user_id == 1)
        <!-- 系统管理 -->
        <div class="modal fade" id="system-panel">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                        <h4 class="modal-title">系统设置</h4>
                    </div>
                    <div class="modal-body">
                        <h2>通用设置</h2>
                        <form id="system-form">
                            <div class="form-group">
                                <label>开启注册</label>
                                <select class="form-control" name="open_register">
                                    <option value="true" @if($system_setting['open_register'] == 'true') selected = "selected" @endif>True</option>
                                    <option value="false" @if($system_setting['open_register'] != 'true') selected = "selected" @endif>False</option>
                                </select>
                            </div>
                        </form>
                        <h2>用户管理</h2>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>用户ID</th>
                                    <th>用户名</th>
                                    <th>用户邮箱</th>
                                    <th>注册时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                            @foreach ($all_user as $user_one)
                                <tr>
                                    <td>{{ $user_one['id'] }}</td>
                                    <td>{{ $user_one['name'] }}</td>
                                    <td>{{ $user_one['email'] }}</td>
                                    <td>{{ $user_one['created_at'] }}</td>
                                    @if ($user_one['id'] != 1)
                                        <td><a href="javascript:xknote.delete_user({{ $user_one['id'] }});">删除</a></td>
                                    @else
                                        <td></td>
                                    @endif
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary" id="system-save" data-dismiss="modal">保存</button>
                    </div>
                </div>
            </div>
        </div>
    @endif
@endsection

@section('style')
    <link rel="stylesheet" href="editor.md/css/editormd.min.css" />
    <style>.markdown-body ol, .markdown-body ul { padding-left: 1em }</style>
@endsection

@section('script')
    <script src="{{ asset('editor.md/editormd.min.js') }}"></script>
    <script src="{{ asset('js/main.js') }}"></script>
    <script type="text/javascript">
        {!! $setting !!}
        xknote.start();
    </script>
@endsection
