import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EventBusPlugin extends Vue {
  public install() {
    const eventBus = new Vue();
    Object.defineProperty(Vue.prototype, '$EventBus', { value: eventBus });
  }
}
