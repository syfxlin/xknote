import "./bootstrap";
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import routes from "./routes";

const router = new VueRouter({
    routes
});
window.vm = new Vue({
    el: "#app",
    router
});
