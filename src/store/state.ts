import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';

import Vue from 'vue';
const localVue = new Vue();

@Module({ namespaced: true })
export default class State extends VuexModule {
  public states: any = {
    snackbar: {
      status: false,
      msg: '',
    },
    menuCurrent: {},
    chatManager: {
      isActiveDialog: false,
      idNpa: 0,
      idChat: 0,
    },
    sidenav: {
      isActive: false,
    },
    priority: {
      isActiveAdd: false,
    },
    correspondent: {
      isActiveAdd: false,
    },
    documentType: {
      isActiveAdd: false,
    },
    page: {
      main: {
        id: localStorage.getItem('user-page-main-id') || null,
      },
    },
  };

  get STATES() {
    return this.states;
  }

  @Action
  public SET_STATE(data: any) {
    this.context.commit('CHANGE_STATE', data);
  }

  @Action
  public VIEW_NOTIFICATION(message: string) {
    this.context.commit('CHANGE_STATE', {
      snackbar: {
        status: true,
        msg: message,
      },
    });
  }

  @Action
  public async SET_DEFAULT_STATE(): Promise<any> {
    try {
      const result: any = await localVue.$API.object.menu.current();
      const views = localVue.$_.get(result, 'data.models', []);
      const mainPage = localVue.$_.filter(views, (item: any) =>
        localVue.$_.get(item, 'primary'),
      );

      localStorage.setItem(
        'user-page-main-id',
        localVue.$_.get(mainPage, '0.id', null),
      );

      this.context.commit('CHANGE_STATE', {
        page: {
          main: {
            id: localVue.$_.get(mainPage, '0.id', null),
          },
        },
      });
      this.context.commit('ADD_MENU_DATA', { menuCurrent: result.data });
    } catch (e) {}
  }

  @Mutation
  public CHANGE_STATE(data: any) {
    this.states = localVue.$_.merge(this.states, data);
  }

  @Mutation
  public ADD_MENU_DATA(data: any) {
    this.states = localVue.$_.merge(this.states, data);
    localVue.$EventBus.$emit('UPDATE_VIEW');
  }
}
