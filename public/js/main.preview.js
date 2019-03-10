window.xknote_view = [];
/**
 * 清除菜单的active状态
 */
function menu_active_clean() {
    var node =  document.getElementById('menu-select').children;
    for (var i = 0; i < node.length; i++) {
        var ele = node[i];
        if(ele.classList == 'active') {
            ele.classList = '';
            return ele;
        }
    }
}
/**
 * 添加菜单的active状态
 */
xknote_view.menu_selected = function(ele) {
    var active = menu_active_clean();
    document.getElementById(active.children[0].id.substr(7)).classList.add('hide');
    ele.parentNode.classList = 'active';
    document.getElementById(ele.id.substr(7)).classList.remove('hide');
};
var EditormdView;
xknote_view.start = function() {
    if(window.top != window) {
        window.note = window.top.note;
        xknote_view.editormd_view_build();
    } else {
        xknote_view.editormd('none');
    }
};
xknote_view.editormd_view_build = function() {
    $('#header-title').text(window.note.note_title);
    $('#header-bottom').html('<div class="col-md-4">作者：'+window.note.note_author+'</div><div class="col-md-4">创建时间：'+window.note.note_created_at+'</div><div class="col-md-4">修改时间：'+window.note.note_updated_at+'</div>');
    EditormdView = editormd.markdownToHTML("editormd-view", {
        markdown        : window.note.note_content ,
        htmlDecode      : true,
        toc             : true,
        tocm            : true,
        tocContainer    : "#toc-container-view",
        gfm             : true,
        markdownSourceCode : true,
        emoji           : true,
        taskList        : true,
        tex             : false,  // 默认不解析
        flowChart       : true,  // 默认不解析
        sequenceDiagram : true,  // 默认不解析
    });
    $('.markdown-toc-list').tree({
        animate: true,
        initialState: 'expand'
    });
};
xknote_view.editormd = function(file) {
    window.note_m = new $.zui.Messager('加载中...', {
        type: 'primary',
        time: 10000,
        icon: 'icon-share-alt'
    }).show();
    $('#editormd-view').empty();
    $.ajax({
        type: "get",
        url: '/get_note_view',
        data: {
            note_file: file
        },
        dataType: "json",
        success: function (res) {
            window.note_m.hide(function() {
                new $.zui.Messager('加载成功！', {
                    type: 'success',
                    icon: 'icon-check',
                    time: 800
                }).show();
            });
            window.note = res;
            xknote_view.editormd_view_build();
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
};
/**
 * 移动端侧边栏切换
 */
var select = true;
$('#m_menu').click(function () {
    if(select) {
        $('#sidebar').animate({
            right: '0px'
        });
        select = false;
    } else {
        $('#sidebar').animate({
            right: '-75%'
        });
        select = true;
    }
});