import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/auth';
import state from '@/store/state';
import user from '@/store/user';
import notification from '@/store/notification';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    state,
    user,
    notification,
  },
});
