import Vue from 'vue';
import { dispatchSync } from '../syncActions';

const types = {
  SET_CLOUD: 'SET_CLOUD',
  ADD_LOCAL: 'ADD_LOCAL',
  SET_OPENED: 'SET_OPENED',
  SET_READED: 'SET_READED',
  SET_OPENED_INDEX: 'SET_OPENED_INDEX',
  LIST_OPERATE: 'LIST_OPERATE',
  SET_CURR_LIST_SOURCE: 'SET_CURR_LIST_SOURCE',
  CHANGE_COUNT: 'CHANGE_COUNT'
};

const state = {
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

// getters
const getters = {
  getReData(state) {
    return state.reData;
  }
};

// actions
const actions = {
  switchTab({ commit }, tabName) {
    commit('switchTab', tabName);
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
      // this.localList = list;
      list.forEach(item => {
        // this.$set(this.localList, item.path, item);
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
  noteOperate({ commit, dispatch }, { operate, storage, noteInfo = null }) {
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
          for (let i = 0; i < this.localList.length; i++) {
            if (this.localList[i].path === noteInfo.path) {
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
  setCurrListSourceA({ commit }, data) {
    commit(types.SET_CURR_LIST_SOURCE, data);
  }
};

// mutations
const mutations = {
  switchTab(state, tabName) {
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
        // let currIndex = this.$set(this.currList, path, noteInfo.note);
        // this.$set(this.currListSource, path, noteInfo.source);
        state.currList[path] = noteInfo.note;
        state.currListSource[path] = noteInfo.source;
        state.reData = path;
      }
      if (storage === 'local') {
        // return this.$set(this.localList, path, noteInfo);
        state.localList[path] = noteInfo;
        state.reData = path;
      }
      if (storage === 'cloud') {
        let p = '';
        let len = noteInfo === null ? arr.length : arr.length - 1;
        for (let i = 0; i < len; i++) {
          p += '/' + arr[i];
          if (!list[arr[i]]) {
            // this.$set(list, arr[i], {
            //   type: 'folder',
            //   path: p,
            //   name: arr[i],
            //   sub: {}
            // });
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
          // this.$set(list, arr[arr.length - 1], noteInfo);
          list[arr[arr.length - 1]] = noteInfo;
        }
      }
    }
    if (operate === 'delete') {
      let noteList = list[arr[arr.length - 1]];
      // delete list[arr[arr.length - 1]];
      Vue.delete(list, arr[arr.length - 1]);
      if (storage === 'curr') {
        delete state.currListSource[arr[arr.length - 1]];
        Vue.delete(state.currListSource, arr[arr.length - 1]);
      }
      state.reData = noteList;
    }
    if (operate === 'set') {
      // this.$set(list, arr[arr.length - 1], { ...noteInfo });
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
  }
};

export const syncActions = {
  listOperate({ commit, state, dispatchSync }, data) {
    commit(types.LIST_OPERATE, data, { root: true });
    commit(types.CHANGE_COUNT);
    return state.reData;
  },
  loadPathNote({ commit, state }, { path, mode = 'normal' }) {
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
    this.openNote(
      item,
      {
        path: path,
        storage: storage
      },
      mode
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
