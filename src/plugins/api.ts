import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class Api extends Vue {
  public install() {
    const API = {
      object: {
        field: {
          list: (data: any) => axios.post(`/api/object/field/list`, data),
          add: (data: any) => axios.post(`/api/object/field`, data),
          edit: (data: any) => axios.patch(`/api/object/field`, data),
          get: (id: any) => axios.get(`/api/object/field/${id}`),
          delete: (id: any) => axios.delete(`/api/object/field/${id}`),
          types: (id: any) => axios.get(`/api/object/field/types`),
        },
        view: {
          list: (data: any) => axios.post(`/api/object/view/list`, data),
          add: (data: any) => axios.post(`/api/object/view`, data),
          edit: (data: any) => axios.patch(`/api/object/view`, data),
          get: (id: any) => axios.get(`/api/object/view/${id}`),
          delete: (id: any) => axios.delete(`/api/object/view/${id}`),
        },
        class: {
          add: (data: any) => axios.post(`/api/object/class`, data),
          edit: (data: any) => axios.patch(`/api/object/class`, data),
          get: (id: any) => axios.get(`/api/object/class/${id}`),
          delete: (id: any) => axios.delete(`/api/object/class/${id}`),
          list: (data: any) => axios.post(`/api/object/class/list`, data),
        },
        values: {
          add: (data: any) => axios.post(`/api/object/values`, data),
          edit: (data: any) => axios.patch(`/api/object/values`, data),
          get: (id: any) => axios.get(`/api/object/values/${id}`),
          delete: (id: any) => axios.delete(`/api/object/values/${id}`),
          list: (data: any) => axios.post(`/api/object/values/list`, data),
          exists: (id: any) => axios.get(`/api/object/values/${id}/exists`),
          history: (data: any) =>
            axios.post(`/api/object/values/list/history`, data),
          viewList: (data: any) =>
            axios.post(`/api/object/values/list/view`, data),
        },
        rules: {
          add: (data: any) => axios.post(`/api/object/rules`, data),
          edit: (data: any) => axios.patch(`/api/object/rules`, data),
          get: (id: any) => axios.get(`/api/object/rules/${id}`),
          delete: (id: any) => axios.delete(`/api/object/rules/${id}`),
          execute: (data: any) => axios.post(`/api/object/rules/execute`, data),
        },
        trigger: {
          update: (data: any) => axios.post(`/api/object/trigger`, data),
          get: (id: any) => axios.get(`/api/object/trigger/${id}`),
          delete: (id: any) => axios.delete(`/api/object/trigger/${id}`),
          list: (data: any) => axios.post(`/api/object/trigger/list`, data),
          events: (id: any) => axios.get(`/api/object/trigger/events`),
          types: (id: any) => axios.get(`/api/object/trigger/types`),
        },
        menu: {
          edit: (id: number, data: any) =>
            axios.post(`/api/object/menu/${id}`, data),
          get: (id: any) => axios.get(`/api/object/menu/${id}`),
          current: () => axios.get(`/api/object/menu/current`),
        },
      },
      auth: (data: any) => axios.post(`/api/jwt/auth`, data),
      attachment: {
        add: (data: any) =>
          axios.post(`/api/attachments`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }),
        delete: (id: any) => axios.delete(`/api/attachments/${id}`),
      },
      roles: {
        list: (data: any) => axios.post(`/api/roles/list`, data),
      },
      groups: {
        list: (data: any) => axios.post(`/api/groups/list`, data),
      },
      users: {
        get: (id: any) => axios.get(`/api/user/${id}`),
        list: (data: any) => axios.post(`/api/user/list`, data),
      },
      notification: {
        count: () => axios.get(`/api/notification/count`),
        list: (data: any) => axios.post(`/api/notification/list`, data),
        view: (id: any) => axios.post(`/api/notification/view/${id}`),
      },
      axios: () => axios,
    };

    Object.defineProperty(Vue.prototype, '$API', { value: API });
  }
}
