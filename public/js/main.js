window.xknote = [];
/**
 * 编辑器
 */
var Editor;
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
 * 移动端侧边栏切换
 */
var select = true;
$('#m_menu').click(function () {
    if(select) {
        $('#sidebar').animate({
            left: '0px'
        });
        $('#copyright').animate({
            left: '0px'
        });
        select = false;
    } else {
        $('#sidebar').animate({
            left: '-75%'
        });
        $('#copyright').animate({
            left: '-75%'
        });
        select = true;
    }
});
/**
 * 显示操作按钮
 */
$('#note-operate').click(function() {
    $('.note-operate-item').toggle();
});
/**
 * 添加菜单的active状态
 */
xknote.menu_selected = function(ele) {
    var active = menu_active_clean();
    document.getElementById(active.children[0].id.substr(7)).classList.add('hide');
    ele.parentNode.classList = 'active';
    document.getElementById(ele.id.substr(7)).classList.remove('hide');
};
/**
 * 初始化Note环境，当本地有存储信息的时候优先读取本地信息
 */
xknote.start = function() {
    if($.zui.store.get('note')) {
        window.note = $.zui.store.get('note');
        xknote.tree_note_show();
        xknote.editormd_build(true, "100%", "calc(100vh - 115px)", true, 'window.note');
        new $.zui.Messager('检测到本地有保存，已从本地读取。', {
            type: 'success',
            close: true,
            time: 7000,
            actions: [{
                name: 'undo',
                icon: 'undo',
                text: '云端加载',
                action: function() {
                    $.zui.store.clear();
                    window.location = '/home';
                }
            }]
        }).show();
        $.zui.store.clear();
    } else {
        xknote.editormd(true, 'none', 'none');
    }
};
/**
 * 构建编辑器
 */
xknote.editormd_on = function(ele) {
    var keyMap = {
        "Ctrl-Alt-S": function(cm) {
            xknote.note_save();
        },
        "Ctrl-S": function(cm) {
            xknote.note_save_loc();
        }
    };
    ele.addKeyMap(keyMap);
    $('.markdown-toc-list').tree({
        animate: true,
        initialState: 'expand'
    });
    var full = false;
    $('[name=fullscreen]').parent().bind('touchstart click', function() {
        if(!full) {
            $('#editormd').css('z-index', '50');
            full = true;
        } else {
            $('#editormd').css('z-index', '47');
            full = false;
        }
    });
};
xknote.editormd_build = function (start, width, height, watch, data) {
    $('#note-title').val(window.note.note_title);
    $('#note-info').children()[0].innerHTML = '创建时间：'+window.note.note_created_at;
    $('#note-info').children()[1].innerHTML = '修改时间：'+window.note.note_updated_at;
    $('#note-info').children()[2].innerHTML = '路径：'+window.note.note_file;
    if(data == 'window.note') {
        data = window.note.note_content;
    }
    $('#note-content').val(data);
    if(start) {
        Editor = editormd("editormd", {
            path: "editor.md/lib/",
            editorTheme: window.setting.editorTheme,
            tocStartLevel: 1,
            tocm: window.setting.tocm,
            tocContainer : "#toc-container",
            codeFold : true,
            height: height,
            width: width,
            watch: watch,
            markdown: data,
            imageUpload : window.setting.imageUpload,
            imageFormats : window.setting.imageFormats,
            imageUploadURL : "/upload_img",
            htmlDecode : window.setting.htmlDecode,
            emoji : window.setting.emoji,
            taskList : window.setting.taskList,
            tex : window.setting.tex,
            flowChart : window.setting.flowChart,
            sequenceDiagram : window.setting.sequenceDiagram,
            saveHTMLToTextarea: true,
            onload: function () {
                xknote.editormd_on(this);
            },
            onchange: function () {
                xknote.editormd_on(this);
            }
        });
        Editor.setToolbarAutoFixed(false);
    } else {
        Editor.config({
            height: height,
            width: width,
            watch: watch
        });
    }
};
/**
 * 获取文章信息
 */
xknote.editormd = function(start, note_file) {
    window.note_m = new $.zui.Messager('加载中...', {
        type: 'primary',
        time: 10000,
        icon: 'icon-share-alt'
    }).show();
    $.ajax({
        type: "get",
        url: "/get_note/",
        data: {
            note_file: note_file
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
            if(note_file == 'none' && res.note_content != 'no_index') {
                xknote.tree_note_show();
            }
            xknote.editormd_build(start ,"100%", "calc(100vh - 115px)", true, 'window.note');
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
 * 去除路径和文件名中的 / 和 . ,同时展开当前文件的文件夹
 */
xknote.tree_note_show = function() {
    var dir_index = window.note.note_file;
    var li = $('#'+dir_index.replace(/[\/.]/ig,''));
    $('#treeMenu li.active').removeClass('active');
    li.addClass('active');
    $('#treeMenu').tree('show', li);
};
/**
 * 设置文件夹active状态
 */
$('#treeMenu').on('click', 'a', function() {
    $('#treeMenu li.active').removeClass('active');
    $(this).closest('li').addClass('active');
});
/**
 * 写作模式
 */
xknote.write_mode = function() {
    $('#header').css('z-index','30');
    $('#fixed-background').show();
    $('#editormd').css({
        'position':'fixed',
        'width': '70vw',
        'top': '0px',
        'height': '100vh',
        'left': '15vw',
        'z-index': '1001'
    });
    xknote.editormd_build(false, "70vw", "100vh", false, document.getElementById('editormd').children[0].value);
};
/**
 * 普通模式
 */
xknote.nomal_mode = function() {
    $('#header').css('z-index','49');
    $('#fixed-background').hide();
    $('#fixed-background-read').hide();
    $('#editormd').css({
        'position':'',
        'width': '100%',
        'top': '',
        'height': 'calc(100vh - 115px)',
        'left': '',
        'z-index': '47'
    });
    xknote.editormd_build(false, "100%", "calc(100vh - 115px)", true, document.getElementById('editormd').children[0].value);
    $('#fixed-background-read iframe').remove();
};
/**
 * 阅读模式
 */
xknote.read_mode = function() {
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    var data = {
        'note_title': $('#note-title').val(),
        'note_created_at': window.note.note_created_at,
        'note_updated_at': date,
        'note_content': $('#note-content').val(),
        'note_file': window.note.note_file
    };
    window.note = data;
    $('#fixed-background-read').append('<iframe src="/read" frameborder="0" width="100%" height="100%" name="read-iframe" id="read-iframe"></iframe>');
    $('#fixed-background-read').fadeIn();
};

$('.dp-setting').click(function(e) {
    var dp_ev = e;
    $.zui.ContextMenu.show([{
            label: '重命名该文件夹',
            onClick: function() {
                dp_ev.currentTarget.previousElementSibling.removeAttribute('href');
                dp_ev.currentTarget.previousElementSibling.removeAttribute('onclick');
                dp_ev.currentTarget.previousElementSibling.innerHTML = '<input type="text" value="'+dp_ev.currentTarget.previousElementSibling.innerText+'" class="form-control input-sm" id="dp-setting-1">';
                $(document).keyup(function(event) {
                    if(event.keyCode == 13) {
                        var old_dir = dp_ev.currentTarget.parentElement.getAttribute('dir');
                        var new_dir = old_dir.substring(0, old_dir.lastIndexOf('/')+1)+$("#dp-setting-1").val();
                        xknote.operate_folder_note('move', 'folder', new_dir, old_dir);
                        $(document).unbind(event);
                    }
                });
            }
        }, {
            label: '删除该文件夹',
            onClick: function() {
                xknote.operate_folder_note('delete', 'folder', dp_ev.currentTarget.parentElement.getAttribute('dir'), 'none');
            }
        }], {
            event: e
        });
});

$('.dc-setting').click(function(e) {
    window.dc_ev = e;
    $.zui.ContextMenu.show([{
            label: '公开为博客',
        }, {
            label: '取消公开博客',
        }, {
            type: 'divider'
        }, {
            label: '重命名(移动)',
            onClick: function() {
                dc_ev.currentTarget.previousElementSibling.removeAttribute('href');
                dc_ev.currentTarget.previousElementSibling.removeAttribute('onclick');
                dc_ev.currentTarget.previousElementSibling.innerHTML = '<input type="text" value="'+dc_ev.currentTarget.previousElementSibling.innerText+'" class="form-control input-sm" id="dc-setting-1">';
                $(document).keyup(function(event) {
                    if(event.keyCode == 13) {
                        var old_dir = dc_ev.currentTarget.parentElement.getAttribute('dir');
                        var new_dir = old_dir.substring(0, old_dir.lastIndexOf('/')+1)+$("#dc-setting-1").val();
                        xknote.operate_folder_note('move', 'note', new_dir, old_dir);
                        $(document).unbind(event);
                    }
                });
            }
        }, {
            label: '删除',
            onClick: function() {
                xknote.operate_folder_note('delete', 'note', dc_ev.currentTarget.parentElement.getAttribute('dir'), 'none');
            }
        }], {
            event: e
        });
});
/**
 * 保存提交数据
 */
xknote.note_save = function (){
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    var data = {
        'note_title': $('#note-title').val(),
        'note_created_at': window.note.note_created_at,
        'note_updated_at': date,
        'note_content': $('#note-content').val(),
        'note_file': window.note.note_file
    };
    window.note = data;
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/set_note",
        data: data,
        dataType: "json",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在保存中...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res.save_status) {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('云端保存成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                $.zui.store.clear();
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
};
$('#note-save').click(function() {
    xknote.note_save();
});
/**
 * 本地保存Note
 */
xknote.note_save_loc = function () {
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    var data = {
        'note_title': $('#note-title').val(),
        'note_created_at': window.note.note_created_at,
        'note_updated_at': date,
        'note_content': $('#note-content').val(),
        'note_file': window.note.note_file
    };
    $.zui.store.set('note', data);
    new $.zui.Messager('保存到本地成功！', {
        type: 'success',
        icon: 'icon-check',
        time: 800
    }).show();
};
$('#note-save-loc').click(function() {
    xknote.note_save_loc();
});
/**
 * 新建Note获取所有目录
 */
$('#new-note').click(function() {
    xknote.note_save();
    $('#new-note-title').val("");
    $('#new-note-file').val("");
    $.ajax({
        type: "get",
        url: "/get_folders_only",
        data: "",
        dataType: "json",
        success: function (res) {
            $('#new-note-select').empty();
            $('#new-note-select').append('<option value="/">/</option>');
            for (var i = 0; i < res.length; i++) {
                $('#new-note-select').append('<option value="'+res[i]+'">'+res[i]+'</option>');
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});
/**
 * 新建时重建编辑器
 */
$('#new-note-save').click(function () {
    var d = new Date();
    var date = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
    window.note = {
        'note_title': $('#new-note-title').val(),
        'note_created_at': date,
        'note_updated_at': date,
        'note_content': '',
        'note_file': $('#new-note-select option:selected').val()+'/'+$('#new-note-file').val()
    };
    $('#treeMenu').tree('collapse');
    xknote.editormd_build(false, "100%", "calc(100vh - 115px)", true, "");
});
/**
 * 新建文件夹面板相关
 */
$('#new-folder').click(function () {
    $.ajax({
        type: "get",
        url: "/get_folders_only",
        data: "",
        dataType: "json",
        success: function (res) {
            $('#new-folder-select').empty();
            $('#new-folder-select').append('<option value="/">/</option>');
            for (var i = 0; i < res.length; i++) {
                $('#new-folder-select').append('<option value="'+res[i]+'">'+res[i]+'</option>');
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});
$('#new-folder-save').click(function () {
    xknote.operate_folder_note('create', 'folder', $('#new-folder-select option:selected').val()+'/'+$('#new-folder-file').val(), 'none');
});
/**
 * 操作文件夹
 */
xknote.operate_folder_note = function(type, f_or_n, dir, old_dir) {
    var china_type,data;
    if(type == 'create') {
        china_type = '创建';
        data = {
            data: dir
        };
    } else if(type == 'delete') {
        china_type = '删除';
        data = {
            data: dir
        };
    } else if(type == 'move') {
        china_type = '重命名(移动)';
        data = {
            old_data: old_dir,
            new_data: dir
        };
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/"+type+"_"+f_or_n,
        data: data,
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在'+china_type+'文件夹(文件)中...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager(china_type+'成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                window.location = '/home';
            }
            console.log(res);
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
 * 网络变化时提醒
 */
window.addEventListener('offline', function () {
    xknote.note_save_loc();
    new $.zui.Messager('网络已断开，文章已经临时保存到本地！', {
        type: 'warning',
        icon: 'icon-unlink'
    }).show();
    window.addEventListener('online', function() {
        new $.zui.Messager('网络已恢复，请及时保存到云端！', {
            type: 'success',
            icon: 'icon-unlink'
        }).show();
        window.addEventListener('online', updateIndicator('online'));
    });
});

/**
 * 前端下载文件
 */
var d_t1 = '<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>';
var d_t2 = '</title>';
var d_t3 = '</head><body>';
var d_t4 = '</body></html>';
xknote.note_download = function(data, type) {
    aLink = document.createElement('a');
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    aLink.download = $('#note-title').val()+'.'+type;
    aLink.href = URL.createObjectURL(new Blob([data], {type: 'text/'+type}));
    aLink.dispatchEvent(evt);
};
xknote.note_download_full = function(data) {
    $.ajax({
        type: "get",
        url: "/editor.md/css/editormd.preview.min.css",
        dataType: "text",
        success: function (res) {
            data = d_t1+$('#note-title').val()+d_t2+'<style>'+res+'</style>'+d_t3+'<div class="markdown-body editormd-html-preview">'+data+'</div>'+d_t4;
            xknote.note_download(data, 'html');
        }
    });
};

xknote.git_operate = function(type) {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/git",
        data: {
            type: type
        },
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在操作Git中...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('操作成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
            } else {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('出现错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
};

$('#setting-panel-button').click(function() {
    $('[name=theme]').find("option[value='"+window.setting['theme']+"']").attr("selected",true);
    $('[name=previewTheme]').find("option[value='"+window.setting['previewTheme']+"']").attr("selected",true);
    $('[name=editorTheme]').find("option[value='"+window.setting['editorTheme']+"']").attr("selected",true);
    for(var item in window.setting) {
        if(item == 'id' || item == 'uid') continue;
        if(window.setting[item] == 0) {
            $('[name='+item+']').find("option[value='0']").attr("selected",true);
        } else if(window.setting[item] == 1) {
            $('[name='+item+']').find("option[value='1']").attr("selected",true);
        }
    }
});

$('#setting-save').click(function() {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/set_setting",
        data: $('#setting-form').serializeArray(),
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在保存设置...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('操作成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                window.location = '/home';
            } else {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('出现错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});

$('#git-save').click(function() {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/set_git",
        data: $('#git-form').serializeArray(),
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在保存设置...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('操作成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                window.location = '/home';
            } else {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('出现错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});

xknote.delete_user = function(delete_user_id) {
    var is = confirm("确定删除该用户？");
    if(is) {
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: "POST",
            url: "/delete_user",
            data: {
                delete_user_id: delete_user_id
            },
            dataType: "text",
            beforeSend: function () {
                window.note_save_m = new $.zui.Messager('正在删除该用户...', {
                    type: 'primary',
                    time: 10000,
                    icon: 'icon-share-alt'
                }).show();
            },
            success: function (res) {
                if(res == '1') {
                    window.note_save_m.hide(function() {
                        new $.zui.Messager('操作成功！', {
                            type: 'success',
                            icon: 'icon-check',
                            time: 800
                        }).show();
                    });
                    window.location = '/home';
                } else {
                    window.note_save_m.hide(function() {
                        new $.zui.Messager('出现错误，请重试。', {
                            type: 'danger',
                            icon: 'icon-unlink'
                        }).show();
                    });
                }
            },
            error: function () {
                new $.zui.Messager('出现错误，请重试。', {
                    type: 'danger',
                    icon: 'icon-unlink'
                }).show();
            }
        });
    }
};

$('#system-save').click(function() {
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/set_system",
        data: $('#system-form').serializeArray(),
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在保存设置...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('操作成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                // window.location = '/home';
            } else {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('出现错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});

$('#user-save').click(function() {
    var data = $('#user-form').serializeArray();
    if(data[3]['value'] != data[4]['value']) {
        new $.zui.Messager('两次输入的密码不匹配，请重试。', {
            type: 'danger',
            icon: 'icon-unlink'
        }).show();
    }
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        type: "POST",
        url: "/set_user",
        data: data,
        dataType: "text",
        beforeSend: function () {
            window.note_save_m = new $.zui.Messager('正在保存设置...', {
                type: 'primary',
                time: 10000,
                icon: 'icon-share-alt'
            }).show();
        },
        success: function (res) {
            if(res == '1') {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('操作成功！', {
                        type: 'success',
                        icon: 'icon-check',
                        time: 800
                    }).show();
                });
                $('#user-panel').modal('hide');
            } else if(res == "2") {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('旧密码错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            } else {
                window.note_save_m.hide(function() {
                    new $.zui.Messager('出现错误，请重试。', {
                        type: 'danger',
                        icon: 'icon-unlink'
                    }).show();
                });
            }
        },
        error: function () {
            new $.zui.Messager('出现错误，请重试。', {
                type: 'danger',
                icon: 'icon-unlink'
            }).show();
        }
    });
});