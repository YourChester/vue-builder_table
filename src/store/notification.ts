import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import Vue from 'vue';

const localVue = new Vue();

@Module({ namespaced: true })
export default class Notification extends VuexModule {
  public notification: any = {
    count: 0,
    list: [],
  };

  get COUNT(): object {
    return this.notification.count;
  }

  get LIST(): object {
    return this.notification.list;
  }

  @Action
  public async SET_COUNT() {
    try {
      const result: any = await localVue.$API.notification.count();
      this.context.commit(
        'CHANGE_COUNT',
        localVue.$_.get(result, 'data.count', 0),
      );

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

  @Action
  public async SET_LIST(params: any = {}) {
    try {
      const result: any = await localVue.$API.notification.list(params);
      this.context.commit(
        'CHANGE_LIST',
        localVue.$_.get(result, 'data.content'),
      );

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

  @Action
  public async DELETE_ITEM_IN_LIST(id: any) {
    try {
      const result: any = await localVue.$API.notification.view(id);
      this.context.commit('DELETE_NOTIFICATION', id);

      if (this.notification.count) {
        this.context.commit('CHANGE_COUNT', this.notification.count - 1);
      }

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
  public ADD_NOTIFICATION(item: any) {
    if (localVue.$_.get(this.notification.list, 'length')) {
      this.notification.list.unshift(item);
    } else {
      this.notification.list = [item];
    }
  }

  @Mutation
  public DELETE_NOTIFICATION(id: number) {
    this.notification.list.forEach((element: any, index: number) => {
      if (localVue.$_.get(element, 'id') === id) {
        this.notification.list.splice(index, 1);
        return false;
      }
    });
  }

  @Mutation
  public CHANGE_COUNT(count: any) {
    this.notification.count = count;
  }

  @Mutation
  public CHANGE_LIST(data: any) {
    this.notification.list = data;
  }
}
