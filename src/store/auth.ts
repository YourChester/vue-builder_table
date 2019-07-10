import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';
import store from '@/store';

const localVue = new Vue();

interface AuthInterface {
  token: string;
  status: string;
  hasLoadedOnce: boolean;
}

interface JwtAuthInterface {
  login: string;
  password: string;
}

@Module({ namespaced: true })
export default class Auth extends VuexModule {
  public auth: AuthInterface = {
    token: localStorage.getItem('user-token') || '',
    status: '',
    hasLoadedOnce: false,
  };

  get isAuthenticated() {
    return !!this.auth.token;
  }

  get authStatus() {
    return this.auth.status;
  }

  @Action
  public async AUTH_REQUEST(user: JwtAuthInterface): Promise<any> {
    try {
      const response: any = await localVue.$Axios.post('/api/jwt/auth', user);
      const token = response.data.token;

      localStorage.setItem('user-token', token);
      localVue.$Axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      this.context.commit('CHANGE_TOKEN', token);
      this.context.commit('CHANGE_AUTH_SUCCESS', token);
      store.dispatch('user/SET_ITEM');

      return {
        success: true,
        response,
      };
    } catch (error) {
      this.context.commit('CHANGE_AUTH_ERROR', error);
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-permission');

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Action
  public async AUTH_LOGOUT(): Promise<any> {
    try {
      await this.context.commit('CHANGE_AUTH_LOGOUT');

      localVue.$Axios.defaults.headers.common.Authorization = '';
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-permission');
      localStorage.removeItem('user-page-main-id');

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  @Mutation
  public CHANGE_AUTH_SUCCESS(token: string) {
    this.auth.status = 'success';
    this.auth.token = token;
    this.auth.hasLoadedOnce = true;
  }

  @Mutation
  public CHANGE_AUTH_ERROR() {
    this.auth.status = 'error';
    this.auth.hasLoadedOnce = true;
  }

  @Mutation
  public CHANGE_AUTH_LOGOUT() {
    this.auth.token = '';
  }

  @Mutation
  public CHANGE_TOKEN(token: string) {
    this.auth.token = token;
  }
}
