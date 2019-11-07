const types = {
  SHOW: 'SHOW',
  HIDE: 'HIDE',
  SHIFT_LIST: 'SHIFT_LIST',
  PUSH_LIST: 'PUSH_LIST'
};

const state = {
  show: false,
  message: '',
  status: '',
  toastList: []
};

const getters = {};

const actions = {
  showToast({ commit, state }, toast) {
    let t = document.querySelector('.toast');
    t.style.visibility = 'visible';
    t.style.opacity = '1';
    commit(types.SHOW, { message: toast.message, status: toast.status });
  },
  hideToast({ commit, state }) {
    return new Promise((resolve, reject) => {
      let t = document.querySelector('.toast');
      setTimeout(() => {
        t.style.visibility = 'hidden';
      }, 500);
      t.style.opacity = '0';
      commit(types.HIDE);
      resolve();
    });
  },
  popToast({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      let toast = state.toastList[0];
      commit(types.SHIFT_LIST);
      dispatch('showToast', { message: toast.message, status: toast.status });
      setTimeout(() => {
        dispatch('hideToast').then(() => {
          if (state.toastList.length !== 0) {
            dispatch('popToast').then(() => {
              resolve();
            });
          }
        });
      }, toast.delay);
    });
  },
  timeToast({ commit, state, dispatch }, toast) {
    commit(types.PUSH_LIST, {
      message: toast.message,
      status: toast.status,
      delay: toast.delay
    });
    if (state.toastList.length === 1) {
      dispatch('popToast');
    }
  }
};

const mutations = {
  [types.SHOW](state, toast) {
    state.message = toast.message;
    state.status = toast.status;
    state.show = true;
  },
  [types.HIDE](state) {
    state.show = false;
  },
  [types.SHIFT_LIST](state) {
    state.toastList.shift();
  },
  [types.PUSH_LIST](state, toast) {
    state.toastList.push(toast);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
