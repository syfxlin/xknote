const state = {};

const getters = {};

const actions = {
  configOperate({ state }, { operate, config = null }) {
    return new Promise((resolve, reject) => {
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

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
