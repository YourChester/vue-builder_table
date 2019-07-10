import Vue from 'vue';
import '@/plugins/vuetify';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import Api from '@/plugins/api';
import Lib from '@/plugins/lib';
import Helper from '@/plugins/helper';
import EventBus from '@/plugins/event-bus';

import 'vue-highlight.js/lib/allLanguages';
import 'highlight.js/styles/default.css';

Vue.config.productionTip = false;

Vue.use(new Api());
Vue.use(new Lib());
Vue.use(new Helper());
Vue.use(new EventBus());

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
