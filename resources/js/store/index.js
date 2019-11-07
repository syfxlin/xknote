import Vue from "vue";
import Vuex from "vuex";
import note, { syncActions as syncNote } from "./modules/note";
import toast from "./modules/toast";
import db from "./modules/db";
import tools from "./modules/tools";
import conf from "./modules/conf";
import other from "./modules/other";
import menu from "./modules/menu";

import { dispatchSync } from "./syncActions";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    note,
    toast,
    db,
    tools,
    conf,
    other,
    menu
  }
});

export const syncActions = {
  note: syncNote
};

for (const nKey in syncActions) {
  let getters = {};
  for (const gKey of Object.keys(store.getters)) {
    let k = gKey.split("/");
    if (k[0] === nKey) {
      Object.defineProperty(getters, k[1], {
        get() {
          return store.getters[gKey];
        }
      });
    }
  }
  for (const iKey in syncActions[nKey]) {
    syncActions[nKey][iKey] = syncActions[nKey][iKey].bind(store, {
      state: store.state[nKey],
      rootState: store.state,
      commit: function(type, payload = null, options = null) {
        store.commit(nKey + "/" + type, payload, options);
      }.bind(store),
      dispatch: function(type, payload = null, options = { root: false }) {
        let t = options.root ? type : nKey + "/" + type;
        return store.dispatch(t, payload);
      }.bind(store),
      dispatchSync: function(type, payload = null, options = { root: false }) {
        let t = options.root ? type : nKey + "/" + type;
        return dispatchSync(t, payload);
      }.bind(store),
      rootGetters: store.getters,
      getters: getters
    });
  }
}

store.syncActions = syncActions;
store.dispatchSync = dispatchSync;

export default store;
