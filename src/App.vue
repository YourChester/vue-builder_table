<template>
  <v-app>
    <sidenav></sidenav>

    <transition
      :name="'component-fade'"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>
    <notification></notification>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Notification from '@/components/common/notification/Notification.vue';
import Sidenav from '@/components/header/sidenav/Sidenav.vue';

@Component({
  name: 'App',
  components: {
    Notification,
    Sidenav,
  },
})
export default class App extends Vue {
  public created() {
    this.initAuthData();
  }

  public initAuthData() {
    const vm = this;

    if (localStorage.getItem('user-token')) {
      const token = `Bearer ${localStorage.getItem('user-token')}`;
      this.$Axios.defaults.headers.common.Authorization = token;
      this.$store.dispatch('user/SET_ITEM');
      this.$store.dispatch('state/SET_DEFAULT_STATE');
    }

    // Обработчик ошибок
    this.$Axios.interceptors.response.use(
      (response: any) => {
        return response;
      },
      (error: any) => {
        switch (this.$_.get(error, 'response.status')) {
          // Пользователь не авторизован
          case 401:
            vm.$store.dispatch('auth/AUTH_LOGOUT');
            vm.$router.push('/login');
            break;
          case 403:
            this.$store.dispatch('state/VIEW_NOTIFICATION', 'Доступ запрещен');
            break;
          default:
            break;
        }

        return Promise.reject(error.response.data);
      },
    );
  }
}
</script>
