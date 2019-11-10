const types = {
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
  SHIFT_TOAST_LIST: 'SHIFT_TOAST_LIST',
  PUSH_TOAST_LIST: 'PUSH_TOAST_LIST',
  SHOW_LOAD_TOAST: 'SHOW_LOAD_TOAST',
  HIDE_LOAD_TOAST: 'HIDE_LOAD_TOAST'
};

const state = {
  toast: {
    show: false,
    message: '',
    status: '',
    toastList: []
  },
  loadToast: {
    show: false,
    message: ''
  }
};

const getters = {};

const actions = {
  showToast({ commit, state }, toast) {
    let t = document.querySelector('.toast');
    t.style.visibility = 'visible';
    t.style.opacity = '1';
    commit(types.SHOW_TOAST, { message: toast.message, status: toast.status });
  },
  hideToast({ commit, state }) {
    return new Promise((resolve, reject) => {
      let t = document.querySelector('.toast');
      setTimeout(() => {
        t.style.visibility = 'hidden';
      }, 500);
      t.style.opacity = '0';
      commit(types.HIDE_TOAST);
      resolve();
    });
  },
  popToast({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      let toast = state.toast.toastList[0];
      commit(types.SHIFT_TOAST_LIST);
      dispatch('showToast', { message: toast.message, status: toast.status });
      setTimeout(() => {
        dispatch('hideToast').then(() => {
          if (state.toast.toastList.length !== 0) {
            dispatch('popToast').then(() => {
              resolve();
            });
          }
        });
      }, toast.delay);
    });
  },
  timeToast({ commit, state, dispatch }, toast) {
    commit(types.PUSH_TOAST_LIST, {
      message: toast.message,
      status: toast.status,
      delay: toast.delay
    });
    if (state.toast.toastList.length === 1) {
      dispatch('popToast');
    }
  },
  showLoadToast({ commit }, toast) {
    commit(types.SHOW_LOAD_TOAST, toast);
  },
  hideLoadToast({ commit }) {
    commit(types.HIDE_LOAD_TOAST);
  }
};

const mutations = {
  [types.SHOW_TOAST](state, toast) {
    state.toast.message = toast.message;
    state.toast.status = toast.status;
    state.toast.show = true;
  },
  [types.HIDE_TOAST](state) {
    state.toast.show = false;
  },
  [types.SHIFT_TOAST_LIST](state) {
    state.toast.toastList.shift();
  },
  [types.PUSH_TOAST_LIST](state, toast) {
    state.toast.toastList.push(toast);
  },
  [types.SHOW_LOAD_TOAST](state, toast) {
    state.loadToast.show = true;
    state.loadToast.message = toast.message;
  },
  [types.HIDE_LOAD_TOAST](state) {
    state.loadToast.show = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
