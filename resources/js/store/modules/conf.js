import otherConfig from '../../utils/otherConfig';

const types = {
  SET_USER_CONFIG: 'SET_USER_CONFIG'
};

const state = {
  userConfig: {}
};

const getters = {
  userSetting(state) {
    return {
      tinymceSetting: Object.assign(
        state.userConfig.tinymceSetting,
        otherConfig.tinymceSetting
      ),
      aceSetting: Object.assign(
        state.userConfig.aceSetting,
        otherConfig.aceSetting
      ),
      xkSetting: Object.assign(
        state.userConfig.xkSetting,
        otherConfig.xkSetting
      )
    };
  }
};

const actions = {
  loadUserConfig({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      dispatch('configOperate', { operate: 'getUserConfig' })
        .then(config => {
          commit(types.SET_USER_CONFIG, config);
          resolve(config);
        })
        .catch(reject);
    });
  },
  configOperate({ state }, { operate, config = null }) {
    return new Promise((resolve, reject) => {
      if (operate === 'getUserConfig') {
        window.axios
          .get('/api/user/conf')
          .then(res => {
            resolve(res.data.config);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'getGitConfig') {
        window.axios
          .get('/api/repo/git')
          .then(res => {
            resolve(res.data.config);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      }
      if (operate === 'setGitConfig') {
        window.axios
          .put('/api/repo/git', { ...config })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      }
    });
  }
};

const mutations = {
  [types.SET_USER_CONFIG](state, config) {
    state.userConfig = config;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
