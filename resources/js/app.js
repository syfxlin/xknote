import "./bootstrap";
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import routes from "./routes";
import App from "./App.vue";

const router = new VueRouter({
  routes
});

window.nThis = {};

window.vm = new Vue({
  el: "#app",
  components: {
    App
  },
  template: "<App/>",
  router
});
