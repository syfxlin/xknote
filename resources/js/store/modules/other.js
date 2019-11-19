const state = {};

const getters = {};

const actions = {
  logout() {
    window.axios.post('/logout').then(function() {
      window.location.href = '/';
    });
  },
  gitOperate({ dispatch, rootState }, { operate, path }) {
    if (operate === 'gitPull') {
      dispatch(
        'toast/showLoadToast',
        {
          message: '操作中...'
        },
        { root: true }
      );
      dispatch(
        'note/folderOperate',
        {
          operate: operate,
          folderInfo: { path: path }
        },
        { root: true }
      )
        .then(() => {
          dispatch(
            'toast/timeToast',
            {
              message: 'Git Pull成功！',
              status: 'success',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        })
        .catch(err => {
          dispatch(
            'toast/timeToast',
            {
              message:
                'Git Pull失败，请重试！(' + err.response.data.error + ')',
              status: 'error',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        });
    }
    if (operate === 'gitPush') {
      dispatch(
        'toast/showLoadToast',
        {
          message: '操作中...'
        },
        { root: true }
      );
      dispatch(
        'note/folderOperate',
        { operate: operate, folderInfo: { path: path } },
        { root: true }
      )
        .then(() => {
          dispatch(
            'toast/timeToast',
            {
              message: 'Git Push成功！',
              status: 'success',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        })
        .catch(err => {
          dispatch(
            'toast/timeToast',
            {
              message:
                'Git Push失败，请重试！(' + err.response.data.error + ')',
              status: 'error',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        });
    }
    if (operate === 'gitPushForce') {
      dispatch(
        'toast/showLoadToast',
        {
          message: '操作中...'
        },
        { root: true }
      );
      dispatch(
        'note/folderOperate',
        { operate: operate, folderInfo: { path: path } },
        { root: true }
      )
        .then(() => {
          dispatch(
            'toast/timeToast',
            {
              message: 'Git Push成功！',
              status: 'success',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        })
        .catch(err => {
          dispatch(
            'toast/timeToast',
            {
              message:
                'Git Push失败，请重试！(' + err.response.data.error + ')',
              status: 'error',
              delay: 1000
            },
            { root: true }
          );
          dispatch('toast/hideLoadToast', null, { root: true });
        });
    }
    if (operate === 'gitInitClone') {
      let modal = {};
      modal.content = 'GitInitClone';
      dispatch('tools/showLgModal', modal, { root: true });
    }
    if (operate === 'gitConfig') {
      let modal = {};
      modal.content = 'GitItemConfig';
      modal.data = {
        path: path
      };
      dispatch('tools/showLgModal', modal, { root: true });
    }
    if (operate === 'gitStatus') {
      let modal = {};
      modal.content = 'GitStatus';
      modal.data = {
        path: path
      };
      dispatch('tools/showLgModal', modal, { root: true });
    }
    if (operate === 'gitDiff') {
      let modal = {};
      modal.content = 'AllNoteHistory';
      modal.data = {
        path: path
      };
      dispatch('tools/showLlgModal', modal, { root: true });
    }
  },
  checkLocalOperate({ dispatch, rootState }, { operate, index }) {
    let path = rootState.tools.lgModal.data[index].path;
    if (operate === 'keepLocal') {
      dispatch(
        'note/noteOperate',
        {
          operate: 'read',
          storage: 'local',
          noteInfo: { path: path }
        },
        { root: true }
      ).then(data => {
        dispatch(
          'note/noteOperate',
          {
            operate: 'save',
            storage: 'cloud',
            noteInfo: data
          },
          { root: true }
        ).then(() => {
          rootState.note.localList[path].status = 'C';
          dispatch('tools/delLgModalData', index, { root: true });
          // 将更新后的状态保存到本地
          dispatch(
            'note/noteOperate',
            {
              operate: 'save',
              storage: 'local',
              noteInfo: rootState.note.localList[path]
            },
            { root: true }
          );
        });
      });
    }
    if (operate === 'keepCloud') {
      dispatch(
        'note/noteOperate',
        {
          operate: 'read',
          storage: 'cloud',
          noteInfo: { path: path }
        },
        { root: true }
      ).then(data => {
        dispatch(
          'note/noteOperate',
          {
            operate: 'save',
            storage: 'local',
            noteInfo: data
          },
          { root: true }
        ).then(() => {
          rootState.note.localList[path].status = 'C';
          // this.$delete(this.lgModal.data, index);
          dispatch('tools/delLgModalData', index, { root: true });
        });
      });
    }
    if (operate === 'notOpe') {
      dispatch('tools/delLgModalData', index, { root: true });
    }
  },
  checkLocalStatus({ dispatch, rootState }) {
    document.querySelector('.xknote-check-local').classList.add('loading');
    window.axios
      .post('/api/notes/check', {
        check_list: Object.keys(rootState.note.localList)
      })
      .then(res => {
        let data = {};
        for (let key in rootState.note.localList) {
          data[rootState.note.localList[key].path] = {
            name: rootState.note.localList[key].name,
            path: rootState.note.localList[key].path,
            created_at_l: rootState.note.localList[key].note.created_at,
            updated_at_l: rootState.note.localList[key].note.updated_at,
            created_at_c: res.data.check_list[key].created_at,
            updated_at_c: res.data.check_list[key].updated_at
          };
        }
        dispatch('tools/setLgModalData', data, { root: true });
        dispatch(
          'tools/showLgModal',
          {
            title: '检查状态',
            content: 'CheckLocalStatus',
            confirm: () => {
              dispatch('tools/hideLgModal', null, { root: true });
            },
            cancel: () => {
              dispatch('tools/hideLgModal', null, { root: true });
            }
          },
          { root: true }
        );
        document
          .querySelector('.xknote-check-local')
          .classList.remove('loading');
      });
  },
  imageOperate({ dispatch, rootState }, { operate, name = null }) {
    return new Promise((resolve, reject) => {
      if (operate === 'getAll') {
        window.axios
          .get('/api/images/all')
          .then(res => {
            resolve(res.data.images);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'delete') {
        window.axios
          .delete('/api/images', { params: { name: name } })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
    });
  },
  diffOperate(
    { dispatch, rootState },
    { operate, path, file = null, commit = null }
  ) {
    return new Promise((resolve, reject) => {
      if (operate === 'getLog') {
        window.axios
          .get('/api/repo/log', { params: { path: path, file: file } })
          .then(res => {
            resolve(res.data.logs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'getDiff') {
        window.axios
          .get('/api/repo/diff', {
            params: { path: path, file: file, commit: commit }
          })
          .then(res => {
            resolve(res.data.diffs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'rollback') {
        window.axios
          .post('/api/repo/rollback', {
            path: path,
            file: file,
            commit: commit
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'getAllDiff') {
        window.axios
          .get('/api/repo/diff/all', {
            params: { path: path }
          })
          .then(res => {
            resolve(res.data.diffs);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
    });
  }
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
