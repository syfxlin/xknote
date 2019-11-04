const types = {
  SET_SM_MODAL: 'SET_SM_MODAL'
};

const state = {
  smModal: {
    show: false,
    title: '',
    content: '',
    data: {},
    confirm: () => {},
    cancel: () => {
      this.smModal.show = false;
    }
  },
  lgModal: {
    show: false,
    title: '',
    content: '',
    data: {},
    confirm: () => {},
    cancel: () => {
      this.lgModal.show = false;
    }
  },
  floatMenu: {
    show: false,
    items: [],
    data: {},
    saveAndClose: true
  }
};

const getters = {};

const actions = {
  showSmModal({ commit }, modal) {
    commit({
      ...modal,
      show: true
    });
  },
  hideSmModal({ commit }) {
    commit({
      show: false,
      title: '',
      content: '',
      data: {},
      confirm: () => {},
      cancel: () => {
        this.smModal.show = false;
      }
    });
  }
};

const mutations = {
  [types.SET_SM_MODAL](state, modal) {
    this.smModal = modal;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
