import Vue from "vue";

const types = {
  SET_SM_MODAL: "SET_SM_MODAL",
  SET_MI_MODAL: "SET_MI_MODAL",
  SET_MI_MODAL_DATA: "SET_MI_MODAL_DATA",
  DEL_MI_MODAL_DATA: "DEL_MI_MODAL_DATA",
  SET_LG_MODAL: "SET_LG_MODAL",
  SET_LG_MODAL_DATA: "SET_LG_MODAL_DATA",
  DEL_LG_MODAL_DATA: "DEL_LG_MODAL_DATA",
  SET_FLOAT_MENU: "SET_FLOAT_MENU",
  SET_SAVE_AND_CLOSE: "SET_SAVE_AND_CLOSE",
  SET_WRITE_MODE: "SET_WRITE_MODE",
  SET_SHOW_SIDEBAR: "SET_SHOW_SIDEBAR",
  SET_SHOW_NAVBAR_RIGHT: "SET_SHOW_NAVBAR_RIGHT",
  SET_SHOW_NAVBAR_CENTER: "SET_SHOW_NAVBAR_CENTER"
};

const state = {
  smModal: {
    title: "",
    operate: "",
    data: {},
    confirm: () => {},
    cancel: () => {}
  },
  miModal: {
    title: "",
    operate: "",
    data: {},
    confirm: () => {},
    cancel: () => {}
  },
  lgModal: {
    show: false,
    title: "",
    operate: "",
    data: {},
    confirm: () => {},
    cancel: () => {}
  },
  floatMenu: {
    show: false,
    items: [],
    data: {},
    saveAndClose: true
  },
  writeMode: false,
  showSidebar: false,
  showNavBarRight: !(window.innerWidth < 1300),
  showNavBarCenter: !(window.innerWidth < 991),
  isMinScreen: window.innerWidth < 991
};

const getters = {};

const actions = {
  showSmModal({ commit }, modal) {
    commit(types.SET_SM_MODAL, {
      ...modal
    });
  },
  hideSmModal({ commit }) {
    commit(types.SET_SM_MODAL, {
      title: "",
      operate: "",
      data: {},
      confirm: () => {},
      cancel: () => {}
    });
  },
  showMiModal({ commit }, modal) {
    commit(types.SET_MI_MODAL, {
      ...modal
    });
  },
  hideMiModal({ commit }) {
    commit(types.SET_MI_MODAL, {
      title: "",
      operate: "",
      data: {},
      confirm: () => {},
      cancel: () => {}
    });
  },
  setMiModalData({ commit }, data) {
    commit(types.SET_MI_MODAL_DATA, data);
  },
  delMiModalData({ commit }, index) {
    commit(types.DEL_MI_MODAL_DATA, index);
  },
  showLgModal({ commit }, modal) {
    commit(types.SET_LG_MODAL, {
      ...modal
    });
  },
  hideLgModal({ commit }) {
    commit(types.SET_LG_MODAL, {
      title: "",
      operate: "",
      data: {},
      confirm: () => {},
      cancel: () => {}
    });
  },
  setLgModalData({ commit }, data) {
    commit(types.SET_LG_MODAL_DATA, data);
  },
  delLgModalData({ commit }, index) {
    commit(types.DEL_LG_MODAL_DATA, index);
  },
  showFloatMenu({ commit }, menu) {
    commit(types.SET_FLOAT_MENU, { ...menu, show: true });
  },
  hideFloatMenu({ commit }) {
    commit(types.SET_FLOAT_MENU, { show: false });
  },
  setSaveAndClose({ commit }, saveAndClose) {
    commit(types.SET_SAVE_AND_CLOSE, saveAndClose);
  },
  switchWriteMode({ commit, state }, writeMode = null) {
    if (writeMode === state.writeMode) return;
    commit(
      types.SET_WRITE_MODE,
      writeMode === null ? !state.writeMode : writeMode
    );
    window.XKEditor.switchTypewriter();
    window.XKEditor.switchPreview();
  },
  switchShowSidebar({ commit, state }, show = null) {
    commit(types.SET_SHOW_SIDEBAR, show === null ? !state.showSidebar : show);
  },
  switchShowNavBarRight({ commit, state }, show = null) {
    commit(
      types.SET_SHOW_NAVBAR_RIGHT,
      show === null ? !state.showNavBarRight : show
    );
  },
  switchShowNavBarCenter({ commit, state }, show = null) {
    commit(
      types.SET_SHOW_NAVBAR_CENTER,
      show === null ? !state.showNavBarCenter : show
    );
  }
};

const mutations = {
  [types.SET_SM_MODAL](state, modal) {
    state.smModal = { ...state.smModal, ...modal };
  },
  [types.SET_MI_MODAL](state, modal) {
    state.miModal = { ...state.miModal, ...modal };
  },
  [types.SET_MI_MODAL_DATA](state, data) {
    state.miModal.data = data;
  },
  [types.DEL_MI_MODAL_DATA](state, index) {
    Vue.delete(state.miModal.data, index);
  },
  [types.SET_LG_MODAL](state, modal) {
    state.lgModal = { ...state.lgModal, ...modal };
  },
  [types.SET_LG_MODAL_DATA](state, data) {
    state.lgModal.data = data;
  },
  [types.DEL_LG_MODAL_DATA](state, index) {
    Vue.delete(state.lgModal.data, index);
  },
  [types.SET_FLOAT_MENU](state, menu) {
    state.floatMenu = { ...state.floatMenu, ...menu };
  },
  [types.SET_SAVE_AND_CLOSE](state, saveAndClose) {
    state.floatMenu.saveAndClose = saveAndClose;
  },
  [types.SET_WRITE_MODE](state, mode) {
    state.writeMode = mode;
  },
  [types.SET_SHOW_SIDEBAR](state, show) {
    state.showSidebar = show;
  },
  [types.SET_SHOW_NAVBAR_RIGHT](state, show) {
    state.showNavBarRight = show;
  },
  [types.SET_SHOW_NAVBAR_CENTER](state, show) {
    state.showNavBarCenter = show;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
