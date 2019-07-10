import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

const localVue = new Vue();

@Module({ namespaced: true })
export default class User extends VuexModule {
  public user: any = {
    item: {
      actions: [],
    },
  };

  get ITEM(): object {
    return this.user.item;
  }

  @Action
  public async SET_ITEM(): Promise<any> {
    try {
      const result: any = await localVue.$Axios('/api/personal/info');
      this.context.commit('CHANGE_ITEM', result.data);

      return {
        success: true,
        response: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Mutation
  public CHANGE_ITEM(data: any) {
    this.user.item = data;
  }
}
