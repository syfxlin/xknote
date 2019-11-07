import './bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import routes from './routes';
import App from './App.vue';
import store from './store';

const router = new VueRouter({
  routes
});

const init = async () => {
  await Promise.all([
    store.dispatch('note/loadCloudFolders'),
    store.dispatch('note/loadLocalNotes'),
    store.dispatch('conf/loadUserConfig')
  ]);
  window.vm = new Vue({
    el: '#app',
    components: {
      App
    },
    template: '<App/>',
    router,
    store
  });
};

init();
