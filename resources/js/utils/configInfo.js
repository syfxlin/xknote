const configInfo = {
  userConfig: {
    theme: {
      label: '主题',
      type: 'select',
      options: [
        { label: 'Chrome', value: 'ace/theme/chrome' },
        { label: 'Clouds', value: 'ace/theme/clouds' },
        { label: 'Crimson Editor', value: 'ace/theme/crimson_editor' },
        { label: 'Dawn', value: 'ace/theme/dawn' },
        { label: 'Dreamweaver', value: 'ace/theme/dreamweaver' },
        { label: 'Eclipse', value: 'ace/theme/eclipse' },
        { label: 'GitHub', value: 'ace/theme/github' },
        { label: 'IPlastic', value: 'ace/theme/iplastic' },
        { label: 'Solarized Light', value: 'ace/theme/solarized_light' },
        { label: 'TextMate', value: 'ace/theme/textmate' },
        { label: 'Tomorrow', value: 'ace/theme/tomorrow' },
        { label: 'XCode', value: 'ace/theme/xcode' },
        { label: 'Kuroir', value: 'ace/theme/kuroir' },
        { label: 'KatzenMilch', value: 'ace/theme/katzenmilch' },
        { label: 'SQL Server', value: 'ace/theme/sqlserver' },
        { label: 'Ambiance', value: 'ace/theme/ambiance' },
        { label: 'Chaos', value: 'ace/theme/chaos' },
        { label: 'Clouds Midnight', value: 'ace/theme/clouds_midnight' },
        { label: 'Dracula', value: 'ace/theme/dracula' },
        { label: 'Cobalt', value: 'ace/theme/cobalt' },
        { label: 'Gruvbox', value: 'ace/theme/gruvbox' },
        { label: 'Green on Black', value: 'ace/theme/gob' },
        { label: 'idle Fingers', value: 'ace/theme/idle_fingers' },
        { label: 'krTheme', value: 'ace/theme/kr_theme' },
        { label: 'Merbivore', value: 'ace/theme/merbivore' },
        { label: 'Merbivore Soft', value: 'ace/theme/merbivore_soft' },
        { label: 'Mono Industrial', value: 'ace/theme/mono_industrial' },
        { label: 'Monokai', value: 'ace/theme/monokai' },
        { label: 'Pastel on dark', value: 'ace/theme/pastel_on_dark' },
        { label: 'Solarized Dark', value: 'ace/theme/solarized_dark' },
        { label: 'Terminal', value: 'ace/theme/terminal' },
        { label: 'Tomorrow Night', value: 'ace/theme/tomorrow_night' },
        {
          label: 'Tomorrow Night Blue',
          value: 'ace/theme/tomorrow_night_blue'
        },
        {
          label: 'Tomorrow Night Bright',
          value: 'ace/theme/tomorrow_night_bright'
        },
        {
          label: 'Tomorrow Night 80s',
          value: 'ace/theme/tomorrow_night_eighties'
        },
        { label: 'Twilight', value: 'ace/theme/twilight' },
        { label: 'Vibrant Ink', value: 'ace/theme/vibrant_ink' }
      ]
    },
    keyboardHandler: {
      label: '快捷键绑定',
      type: 'radio',
      options: [
        {
          label: 'Ace',
          value: 'null'
        },
        {
          label: 'Vim',
          value: 'ace/keyboard/vim'
        },
        {
          label: 'Emacs',
          value: 'ace/keyboard/emacs'
        },
        {
          label: 'Sublime',
          value: 'ace/keyboard/sublime'
        }
      ]
    },
    fontSize: {
      label: '字体大小',
      type: 'text'
    },
    wrap: {
      label: '换行模式',
      type: 'radio',
      options: [
        {
          label: 'Off',
          value: 'off'
        },
        {
          label: 'View',
          value: 'free'
        },
        {
          label: 'Margin',
          value: 'printMargin'
        },
        {
          label: '40',
          value: '40'
        }
      ]
    },
    cursorStyle: {
      label: '光标样式',
      type: 'select',
      options: [
        {
          label: 'Ace',
          value: 'ace'
        },
        {
          label: 'Slim',
          value: 'slim'
        },
        {
          label: 'Smooth',
          value: 'smooth'
        },
        {
          label: 'Smooth Slim',
          value: 'smooth slim'
        },
        {
          label: 'Wide',
          value: 'wide'
        }
      ]
    },
    foldStyle: {
      label: '折叠',
      type: 'select',
      options: [
        {
          label: 'Manual',
          value: 'manual'
        },
        {
          label: 'Mark begin',
          value: 'markbegin'
        },
        {
          label: 'Mark begin and end',
          value: 'markbeginend'
        }
      ]
    },
    useSoftTabs: {
      label: '空格缩进',
      type: 'switch'
    },
    tabSize: {
      label: '缩进大小',
      type: 'number'
    },
    scrollPastEnd: {
      label: '过度滚动',
      type: 'radio',
      options: [
        {
          label: 'None',
          value: '0'
        },
        {
          label: 'Half',
          value: '0.5'
        },
        {
          label: 'Full',
          value: '1'
        }
      ]
    },
    behavioursEnabled: {
      label: '启用快捷键',
      type: 'switch'
    },
    selectionStyle: {
      label: '点击行号选择一行',
      type: 'switch'
    },
    highlightActiveLine: {
      label: '高亮当前行',
      type: 'switch'
    },
    showInvisibles: {
      label: '显示不可见字符',
      type: 'switch'
    },
    displayIndentGuides: {
      label: '显示缩进导航',
      type: 'switch'
    },
    hScrollBarAlwaysVisible: {
      label: '永久显示滚动条h',
      type: 'switch'
    },
    vScrollBarAlwaysVisible: {
      label: '永久显示滚动条v',
      type: 'switch'
    },
    animatedScroll: {
      label: '滚动动画',
      type: 'switch'
    },
    showGutter: {
      label: '显示行号栏',
      type: 'switch'
    },
    showLineNumbers: {
      label: '显示行号',
      type: 'switch'
    },
    fixedWidthGutter: {
      label: '固定行号栏宽度',
      type: 'switch'
    },
    highlightSelectedWord: {
      label: '高亮选中字符',
      type: 'switch'
    },
    readOnly: {
      label: '只读模式',
      type: 'switch'
    },
    copyWithEmptySelection: {
      label: '不选择复制',
      type: 'switch'
    },
    enableLiveAutocompletion: {
      label: '自动补全(实时)',
      type: 'switch'
    },
    enableSnippets: {
      label: '自动补全(snippets)',
      type: 'switch'
    },
    enableBasicAutocompletion: {
      label: '自动补全(基础)',
      type: 'switch'
    },
    skin_url: {
      label: 'TinyMCE皮肤',
      type: 'text'
    },
    body_class: {
      label: 'TinyMCE样式class',
      type: 'text'
    },
    content_css: {
      label: 'TinyMCE样式表地址',
      type: 'text'
    },
    previewCss: {
      label: '预览样式表地址',
      type: 'text'
    },
    previewClass: {
      label: '预览样式class',
      type: 'text'
    },
    delayToHtml: {
      label: '延迟渲染',
      type: 'number'
    },
    scrollBind: {
      label: '滚动绑定',
      type: 'radio',
      options: [
        {
          label: 'Both',
          value: 'both'
        },
        {
          label: 'Left',
          value: 'left'
        },
        {
          label: 'Right',
          value: 'right'
        }
      ]
    },
    pasteFormat: {
      label: '粘贴格式化',
      type: 'switch'
    },
    pasteImageUpload: {
      label: '粘贴图片上传',
      type: 'switch'
    },
    enableTinyMCE: {
      label: '开启TinyMCE编辑器',
      type: 'switch'
    }
  },
  blogConfig: {
    blog_system: {
      label: '博客系统',
      type: 'select',
      options: [
        {
          label: 'WordPress',
          value: 'wordpress'
        }
      ],
      required: true
    },
    blog_url: {
      label: '博客链接',
      type: 'url',
      required: true
    },
    blog_username: {
      label: '用户名',
      type: 'text'
    },
    blog_password: {
      label: '密码',
      type: 'password'
    },
    blog_token: {
      label: 'Token',
      type: 'password'
    }
  },
  gitConfig: {
    git_name: {
      label: 'Git用户名',
      type: 'text',
      required: true
    },
    git_email: {
      label: 'Git邮箱',
      type: 'email',
      required: true
    },
    git_password: {
      label: 'Git密码',
      type: 'password',
      required: true
    }
  },
  createFolder: {
    foldername: {
      label: '文件夹名',
      type: 'text',
      required: true
    },
    select: {
      label: '存放的文件夹',
      type: 'text',
      required: true
    }
  },
  createNote: {
    filename: {
      label: '文档名',
      type: 'text',
      required: true
    },
    title: {
      label: '标题',
      type: 'text',
      required: true
    },
    storage: {
      label: '云端/本地',
      type: 'select',
      options: [
        {
          label: '云端',
          value: 'cloud'
        },
        {
          label: '本地',
          value: 'local'
        }
      ],
      required: true
    },
    select: {
      label: '存放的文件夹',
      type: 'text',
      required: true
    }
  },
  gitInitClone: {
    repo: {
      label: 'Repo地址',
      type: 'url',
      required: true
    },
    foldername: {
      label: '文件夹名',
      type: 'text',
      required: true
    },
    init_or_clone: {
      label: 'Init/Clone',
      type: 'select',
      options: [
        {
          label: 'Init',
          value: 'init'
        },
        {
          label: 'Clone',
          value: 'clone'
        }
      ],
      required: true
    },
    git_name: {
      label: 'Git用户名',
      type: 'text',
      placeholder: '若不填写则使用全局默认的配置'
    },
    git_email: {
      label: 'Git邮箱',
      type: 'email',
      placeholder: '若不填写则使用全局默认的配置'
    },
    git_password: {
      label: 'Git密码',
      type: 'password',
      placeholder: '若不填写则使用全局默认的配置'
    }
  },
  gitItemConfig: {
    repo: {
      label: 'Repo地址',
      type: 'url',
      required: true
    },
    git_name: {
      label: 'Git用户名',
      type: 'text',
      required: true
    },
    git_email: {
      label: 'Git邮箱',
      type: 'email',
      required: true
    },
    git_password: {
      label: 'Git密码',
      type: 'password',
      required: true
    }
  },
  moveItem: {
    select: {
      label: '移动到文件夹',
      type: 'text',
      required: true
    }
  },
  personalCenter: {
    username: {
      label: '用户名',
      type: 'text',
      required: true
    },
    nickname: {
      label: '昵称',
      type: 'text',
      required: true
    },
    email: {
      label: '邮箱',
      type: 'email',
      required: true
    },
    old_password: {
      label: '旧密码',
      type: 'password',
      required: true
    },
    password: {
      label: '新密码',
      type: 'password',
      required: true
    },
    password_confirmation: {
      label: '确认密码',
      type: 'password',
      required: true
    }
  },
  pushBlog: {
    title: {
      label: '标题',
      type: 'text',
      required: 'true'
    },
    post_status: {
      label: '发布状态',
      type: 'select',
      options: [
        {
          label: 'publish',
          value: 'publish'
        },
        {
          label: 'future',
          value: 'future'
        },
        {
          label: 'draft',
          value: 'draft'
        },
        {
          label: 'pending',
          value: 'pending'
        },
        {
          label: 'private',
          value: 'private'
        }
      ],
      required: true
    },
    slug: {
      label: '别名',
      type: 'text'
    },
    excerpt: {
      label: '摘录',
      type: 'text'
    },
    categories: {
      label: '分类',
      type: 'text'
    },
    tags: {
      label: '标签',
      type: 'text'
    }
  },
  systemConfig: {
    enable_register: {
      label: '开放注册',
      type: 'switch',
      required: true
    },
    xknote_name: {
      label: 'XK-Note名称',
      type: 'text',
      required: true
    },
    upload_limit: {
      label: '上传图片限制',
      type: 'number',
      required: true
    }
  }
};

export default configInfo;
