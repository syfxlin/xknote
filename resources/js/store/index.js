import Vue from 'vue';
import Vuex from 'vuex';
import note, { syncActions as syncNote } from './modules/note';
import toast from './modules/toast';
import db from './modules/db';
import tools from './modules/tools';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    note,
    toast,
    db,
    tools
  }
});

export const syncActions = {
  note: syncNote
};

for (const mKey in syncActions) {
  for (const iKey in syncActions[mKey]) {
    syncActions[mKey][iKey] = syncActions[mKey][iKey].bind(store);
  }
}

store.syncActions = syncActions;

export default store;
