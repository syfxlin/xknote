const navBarListC = [
  {
    mainItem: {
      name: '云端保存',
      operate: 'saveCloud'
    },
    items: [
      {
        name: '本地保存',
        operate: 'saveLocal'
      },
      {
        name: '全部保存到云端',
        operate: 'saveAllCloud'
      },
      {
        name: '全部保存到本地',
        operate: 'saveAllLocal'
      }
    ]
  },
  {
    mainItem: {
      name: '导出'
    },
    items: [
      {
        name: '导出为Markdown文件',
        operate: 'downloadMarkdown'
      },
      {
        name: '导出HTML文件',
        operate: 'downloadHTML'
      },
      {
        name: '导出带样式的HTML文件',
        operate: 'downloadFullHTML'
      }
    ]
  },
  {
    mainItem: {
      name: '操作'
    },
    items: [
      {
        name: 'divider',
        content: 'Git'
      },
      {
        name: 'Push',
        operate: 'gitPush'
      },
      {
        name: 'Pull',
        operate: 'gitPull'
      },
      {
        name: 'Init Clone',
        operate: 'gitInitClone'
      },
      {
        name: 'Push Force',
        operate: 'gitPushForce'
      },
      {
        name: 'Git Config',
        operate: 'gitConfig'
      }
    ]
  }
];

const navBarListR = [
  {
    mainItem: {
      name: '新建MD笔记',
      operate: 'showCreateNote',
      style: 'btn-primary'
    },
    items: [
      {
        name: '新建文件夹',
        operate: 'showCreateFolder'
      }
    ]
  },
  {
    mainItem: {
      name: '{ name }',
      style: 'btn-link'
    },
    items: [
      {
        name: '个人中心',
        operate: 'showPersonalCenter'
      },
      {
        name: '用户设置',
        operate: 'showUserConfig'
      },
      {
        name: 'Git设置',
        operate: 'showGitConfig'
      },
      {
        name: '系统管理',
        operate: 'showSystemConfig'
      },
      {
        name: 'divider',
        content: null
      },
      {
        name: '登出',
        operate: 'logout'
      }
    ]
  }
];

if (window.xknote.user_id != '1') {
  navBarListR[1].items.splice(
    navBarListR[1].items.findIndex(item => {
      return item.operate === 'showSystemConfig';
    }),
    1
  );
}

navBarListR[1].mainItem.name = window.xknote.nickname;

export default {
  navBarListC: navBarListC,
  navBarListR: navBarListR
};
