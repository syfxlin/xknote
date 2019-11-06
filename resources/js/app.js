import "./bootstrap";
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import routes from "./routes";
import App from "./App.vue";
import store from "./store";

const router = new VueRouter({
  routes
});

const init = async () => {
  await store.dispatch("note/loadCloudFolders");
  await store.dispatch("note/loadLocalNotes");
  window.vm = new Vue({
    el: "#app",
    components: {
      App
    },
    template: "<App/>",
    router,
    store
  });
};

init();
