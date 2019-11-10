import Vue from 'vue';

const types = {
  SET_XKNOTE_TAB: 'SET_XKNOTE_TAB',
  SET_CLOUD: 'SET_CLOUD',
  ADD_LOCAL: 'ADD_LOCAL',
  SET_OPENED: 'SET_OPENED',
  SET_READED: 'SET_READED',
  SET_OPENED_INDEX: 'SET_OPENED_INDEX',
  LIST_OPERATE: 'LIST_OPERATE',
  SET_CURR_LIST_SOURCE: 'SET_CURR_LIST_SOURCE',
  CHANGE_COUNT: 'CHANGE_COUNT',
  SET_PREV_ROUTER: 'SET_PREV_ROUTER'
};

const state = {
  prevRouter: null,
  noteBaseInfo: {
    type: 'note',
    path: '',
    name: '',
    status: 'N',
    note: {
      title: '',
      author: '',
      content: '暂未打开任何文件，请选择文件。',
      created_at: '',
      updated_at: ''
    }
  },
  xknoteOpened: {
    type: 'note',
    path: '',
    name: '',
    status: 'N',
    note: {
      title: '',
      author: '',
      content: '暂未打开任何文件，请选择文件。',
      created_at: '',
      updated_at: ''
    }
  },
  // 存储当前开启的文档的位置，当前位置和源位置
  // curr存储的是位于currList的索引
  // source存储的分别是源的位置 本地or云端（data-storage） 在其列表中的index（data-index）
  xknoteOpenedIndex: {
    curr: '',
    source: {
      path: '',
      storage: ''
    }
  },
  // currList的扩展信息
  currListSource: {},
  currList: {},
  cloudList: {},
  localList: {},
  xknoteTab: 'cloud',
  readOpened: {
    type: 'note',
    path: '',
    name: '',
    status: 'N',
    note: {
      title: '',
      author: '',
      content: '暂未打开任何文件，请选择文件。',
      created_at: '',
      updated_at: ''
    }
  },
  reData: null,
  currBadgeCount: 0,
  localBadgeCount: 0
};

const getters = {
  getReData(state) {
    return state.reData;
  }
};

const actions = {
  switchTab({ commit }, tabName) {
    commit(types.SET_XKNOTE_TAB, tabName);
  },
  async loadCloudFolders({ commit, dispatch }) {
    let data = await dispatch('folderOperate', {
      operate: 'readAll',
      folderInfo: null
    });
    commit(types.SET_CLOUD, data.folders);
    return data;
  },
  loadLocalNotes({ commit, dispatch }) {
    dispatch(
      'db/noteLocalDB',
      {
        operate: 'readAll',
        data: ''
      },
      { root: true }
    ).then(list => {
      list.forEach(item => {
        commit(types.ADD_LOCAL, { path: item.path, data: item });
      });
    });
  },
  folderOperate({ commit, dispatch }, { operate, folderInfo = null }) {
    return new Promise((resolve, reject) => {
      if (operate === 'readAll') {
        window.axios
          .get('/api/folders')
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'readFlat') {
        window.axios
          .get('/api/folders/flat')
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'readOnly') {
        window.axios
          .get('/api/folders/only')
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'rename') {
        window.axios
          .put('/api/folders', {
            old_path: folderInfo.oldFolder.path,
            new_path: folderInfo.folder.path
          })
          .then(res => {
            console.log(res);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'move') {
        window.axios
          .put('/api/folders/move', {
            old_path: folderInfo.oldPath,
            new_path: folderInfo.newPath
          })
          .then(res => {
            console.log(res);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'create') {
        window.axios
          .post('/api/folders', {
            path: folderInfo.path
          })
          .then(res => {
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'delete') {
        window.axios
          .delete('/api/folders', {
            params: {
              path: folderInfo.path
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'exist') {
        window.axios
          .get('/api/folders/exist', {
            params: { path: folderInfo.path }
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      // TODO: 添加加载时提示
      if (operate === 'gitPush' || operate === 'gitPushForce') {
        window.axios
          .put('/api/repo', {
            path: folderInfo.path,
            force: operate === 'gitPushForce'
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'gitPull') {
        window.axios
          .get('/api/repo', {
            params: { path: folderInfo.path }
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'gitInit' || operate === 'gitClone') {
        window.axios
          .post('/api/repo', {
            path: folderInfo.path,
            repo: folderInfo.repo,
            init_or_clone: operate === 'gitInit' ? 'init' : 'clone',
            ...folderInfo.git_user
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'getGitConfig') {
        window.axios
          .get('/api/repo/conf', { params: { path: folderInfo.path } })
          .then(res => {
            resolve(res.data.config);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
        if (operate === 'setGitConfig') {
          window.axios
            .put('/api/repo/conf', { ...folderInfo })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });
        }
      }
    });
  },
  noteOperate(
    { commit, dispatch, state },
    { operate, storage, noteInfo = null }
  ) {
    return new Promise((resolve, reject) => {
      if (operate === 'read') {
        if (storage === 'local') {
          dispatch(
            'db/noteLocalDB',
            {
              operate: 'read',
              data: noteInfo.path
            },
            { root: true }
          ).then(res => {
            resolve(res);
          });
        }
        if (storage === 'cloud') {
          window.axios
            .get('/api/notes', {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      }
      if (operate === 'create') {
        if (storage === 'cloud') {
          window.axios
            .post('/api/notes', {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              resolve(err);
            });
        }
      }
      if (operate === 'delete') {
        if (storage === 'local') {
          dispatch(
            'db/noteLocalDB',
            {
              operate: 'delete',
              data: noteInfo.path
            },
            { root: true }
          )
            .then(data => {
              resolve(data);
            })
            .catch(reject);
        }
        if (storage === 'cloud') {
          window.axios
            .delete('/api/notes', {
              params: {
                path: noteInfo.path
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      }
      if (operate === 'save') {
        if (storage === 'local') {
          dispatch(
            'db/noteLocalDB',
            {
              operate: 'delete',
              data: noteInfo.path
            },
            { root: true }
          )
            .then(() => {
              dispatch(
                'db/noteLocalDB',
                {
                  operate: 'add',
                  data: noteInfo
                },
                { root: true }
              )
                .then(res => {
                  resolve(res);
                })
                .catch(reject);
            })
            .catch(reject);
        }
        if (storage === 'cloud') {
          window.axios
            .put('/api/notes', {
              path: noteInfo.path,
              title: noteInfo.note.title,
              author: noteInfo.note.author,
              created_at: noteInfo.note.created_at,
              updated_at: noteInfo.note.updated_at,
              content: noteInfo.note.content
            })
            .then(res => {
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      }
      if (operate === 'rename') {
        if (storage === 'local') {
          dispatch(
            'db/noteLocalDB',
            {
              operate: 'delete',
              data: noteInfo.oldNote.path
            },
            { root: true }
          );
          dispatch(
            'db/noteLocalDB',
            { operate: 'add', data: noteInfo.note },
            { root: true }
          );
          resolve();
        }
        if (storage === 'cloud') {
          window.axios
            .put('/api/notes/rename', {
              old_path: noteInfo.oldNote.path,
              new_path: noteInfo.note.path
            })
            .then(res => {
              console.log(res);
              if (res.data.error == false) {
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
      }
      if (operate === 'move') {
        window.axios
          .put('/api/notes/move', {
            old_path: noteInfo.oldPath,
            new_path: noteInfo.newPath
          })
          .then(res => {
            console.log(res);
            if (res.data.error == false) {
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'exist') {
        if (storage === 'cloud') {
          window.axios
            .get('/api/notes/exist', {
              params: { path: noteInfo.path }
            })
            .then(res => {
              resolve(res.data);
            })
            .catch(err => {
              console.error(err);
              reject(err);
            });
        }
        if (storage === 'local') {
          let flag = false;
          for (let i = 0; i < state.localList.length; i++) {
            if (state.localList[i].path === noteInfo.path) {
              flag = true;
            }
          }
          resolve({ exist: flag });
        }
      }
    });
  },
  setXknoteOpenedA({ commit }, noteInfo) {
    commit(types.SET_OPENED, noteInfo);
  },
  setReadOpenedA({ commit }, noteInfo) {
    commit(types.SET_READED, noteInfo);
  },
  setXknoteOpenedIndexA({ commit }, index) {
    commit(types.SET_OPENED_INDEX, index);
  },
  setPrevRouter({ commit }, router) {
    commit(types.SET_PREV_ROUTER, router);
  },
  setCurrListSourceA({ commit }, data) {
    commit(types.SET_CURR_LIST_SOURCE, data);
  },
  loadPathNote({ commit, state, dispatch }, { path, mode = 'normal' }) {
    let info = document.querySelector('.local-tab [data-path="' + path + '"]');
    if (!info) {
      info = document.querySelector('.cloud-tab [data-path="' + path + '"]');
    }
    if (!info) {
      return;
    }
    let storage = info.getAttribute('data-storage');
    commit(types.LIST_OPERATE, {
      operate: 'get',
      storage: storage,
      path: path
    });
    let item = state.reData;
    dispatch('openNote', {
      note: item,
      source: {
        path: path,
        storage: storage
      },
      mode: mode
    });
  },
  openNote(
    { commit, state, dispatch },
    { note, source, mode = 'normal', isNew = false }
  ) {
    let open = function() {
      // 更改query
      window.inputQueryChangeFlag = false;
      if (
        !window.vm.$route.query.note ||
        window.vm.$route.query.note !== note.path
      ) {
        window.vm.$router.replace({
          query: {
            ...window.vm.$route.query,
            note: note.path
          }
        });
      }
      if (mode === 'normal') {
        for (let key in state.currList) {
          if (state.currList[key].path === note.path) {
            source.path = note.path;
            source.storage = 'curr';
          }
        }
        dispatch('setXknoteOpened', note);
        window.xknoteOpenedChangeFlag = false;
        // 添加到currList，同时将源数据添加到currListSource
        let currPath;
        if (source.storage !== 'curr') {
          commit(types.LIST_OPERATE, {
            operate: 'add',
            storage: 'curr',
            path: note.path,
            noteInfo: {
              note: note,
              source: source
            }
          });
          currPath = note.path;
        } else {
          currPath = source.path;
        }
        commit(types.SET_OPENED_INDEX, {
          curr: currPath,
          source: source
        });
        commit(types.SET_XKNOTE_TAB, 'curr');
        Vue.nextTick(() => {
          // 添加当前打开的文件的active效果
          let ele;
          ele = document.querySelector(".active[data-storage='curr']");
          if (ele) {
            ele.classList.remove('active');
          }
          document
            .querySelector(
              "[data-storage='curr'][data-path='" + note.path + "']"
            )
            .classList.add('active');
          window.xknoteOpenedChangeFlag = true;
        });
      }
      if (mode === 'read') {
        commit(types.SET_READED, JSON.parse(JSON.stringify(note)));
      }
    };
    if (!isNew && source.storage === 'cloud') {
      let noteEle = document.querySelector(
        '[data-path="' + note.path + '"][data-storage="cloud"]'
      );
      let icon = noteEle.querySelector('.tile-action');
      icon.style.display = 'unset';
      let btn = icon.querySelector('.btn');
      if (mode === 'normal') {
        btn.querySelector('.icon').style.display = 'none';
      }
      btn.querySelector('.loading').style.display = 'block';
      dispatch('noteOperate', {
        operate: 'read',
        storage: 'cloud',
        noteInfo: note
      }).then(data => {
        Vue.set(note, 'note', data.note);
        note.status = 'C';
        icon.style.display = '';
        if (mode === 'normal') {
          btn.querySelector('.icon').style.display = 'unset';
        }
        btn.querySelector('.loading').style.display = 'none';
        open();
      });
    } else {
      open();
    }
  },
  setXknoteOpened({ commit, state }, noteInfo) {
    window.xknoteOpenedChangeFlag = false;
    let noteConEle = document.querySelector('.xknote-header > .navbar-center');
    if (noteInfo.path === '') {
      window.XKEditor.ace.setReadOnly(true);
      if (noteConEle) {
        noteConEle.classList.add('disabled');
      }
    } else {
      window.XKEditor.ace.setReadOnly(false);
      if (noteConEle) {
        noteConEle.classList.remove('disabled');
      }
    }
    commit(types.SET_OPENED, noteInfo);
    if (window.eThis && window.XKEditor) {
      if (window.eThis.e.editorMode === 'ace') {
        window.XKEditor.setMarkdown(state.xknoteOpened.note.content);
      } else {
        window.XKEditor.switchEditor();
        window.XKEditor.setMarkdown(state.xknoteOpened.note.content);
      }
    }
    window.xknoteOpenedChangeFlag = true;
  },
  loadFirstNote({ dispatch, state }, mode = 'normal') {
    // 防止意外加载
    // TODO: 寻求更好的方案
    if (mode === 'read' && state.prevRouter) {
      return;
    }
    if (mode !== 'read' && state.xknoteOpened.path) {
      return;
    }
    if (window.vm.$route.query.note) {
      dispatch('loadPathNote', {
        path: window.vm.$route.query.note,
        mode: mode
      });
    } else {
      dispatch(
        'db/optionsDB',
        { operate: 'read', data: 'rememberNote' },
        { root: true }
      ).then(data => {
        if (data) {
          dispatch('loadPathNote', { path: data.path, mode: mode });
        }
        dispatch('timedTask', 'saveCurrOpenedNote');
      });
    }
  },
  timedTask({ dispatch, state }, task) {
    if (task === 'saveCurrOpenedNote') {
      // 每10秒中将当前打开的笔记信息保存至本地数据库，用以下次开启做准备
      setInterval(() => {
        if (
          state.xknoteOpened.path !== '' &&
          window.vm.$route.name === 'Home'
        ) {
          dispatch(
            'db/optionsDB',
            {
              operate: 'put',
              data: {
                name: 'rememberNote',
                path: state.xknoteOpened.path
              }
            },
            { root: true }
          );
          console.log('remeberNote');
        }
      }, 10000);
    }
  }
};

const mutations = {
  [types.SET_XKNOTE_TAB](state, tabName) {
    state.xknoteTab = tabName;
  },
  [types.LIST_OPERATE](state, { operate, storage, path, noteInfo = null }) {
    let arr = [path];
    let list = state[storage + 'List'];
    if (storage === 'cloud') {
      arr = path.substring(1).split('/');
      for (let i = 0; operate !== 'add' && i < arr.length - 1; i++) {
        list = list[arr[i]].sub;
      }
    }
    if (operate === 'get') {
      state.reData = list[arr[arr.length - 1]];
    }
    if (operate === 'add') {
      if (storage === 'curr') {
        state.currList[path] = noteInfo.note;
        state.currListSource[path] = noteInfo.source;
        state.reData = noteInfo.note;
      }
      if (storage === 'local') {
        state.localList[path] = noteInfo;
        state.reData = noteInfo;
      }
      if (storage === 'cloud') {
        let p = '';
        let len = noteInfo === null ? arr.length : arr.length - 1;
        for (let i = 0; i < len; i++) {
          p += '/' + arr[i];
          if (!list[arr[i]]) {
            list[arr[i]] = {
              type: 'folder',
              path: p,
              name: arr[i],
              sub: {}
            };
          }
          list = list[arr[i]].sub;
        }
        if (noteInfo !== null) {
          list[arr[arr.length - 1]] = noteInfo;
        }
        state.reData = noteInfo;
      }
    }
    if (operate === 'delete') {
      let noteList = list[arr[arr.length - 1]];
      Vue.delete(list, arr[arr.length - 1]);
      if (storage === 'curr') {
        delete state.currListSource[arr[arr.length - 1]];
        Vue.delete(state.currListSource, arr[arr.length - 1]);
      }
      state.reData = noteList;
    }
    if (operate === 'set') {
      list[arr[arr.length - 1]] = noteInfo;
    }
  },
  [types.SET_CLOUD](state, cloudList) {
    state.cloudList = cloudList;
  },
  [types.ADD_LOCAL](state, { path, data }) {
    state.localList[path] = data;
  },
  [types.SET_OPENED](state, noteInfo) {
    state.xknoteOpened = noteInfo;
  },
  [types.SET_READED](state, noteInfo) {
    state.readOpened = noteInfo;
  },
  [types.SET_OPENED_INDEX](state, index) {
    state.xknoteOpenedIndex = index;
  },
  [types.SET_CURR_LIST_SOURCE](state, { path, source }) {
    state.currListSource[path] = source;
  },
  [types.CHANGE_COUNT](state) {
    state.currBadgeCount = 0;
    state.localBadgeCount = 0;
    for (let key in state.currList) {
      if (state.currList[key].status === 'N') {
        state.currBadgeCount++;
      }
    }
    for (let key in state.localList) {
      if (state.localList[key].status === 'N') {
        state.localBadgeCount++;
      }
    }
  },
  [types.SET_PREV_ROUTER](state, router) {
    state.prevRouter = router;
  }
};

export const syncActions = {
  listOperate({ commit, state, dispatchSync }, data) {
    commit(types.LIST_OPERATE, data, { root: true });
    commit(types.CHANGE_COUNT);
    return state.reData;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
