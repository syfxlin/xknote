import Vue from "vue";
import Vuex from "vuex";
import note from "./modules/note";
import toast from "./modules/toast";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    note,
    toast
  }
});
