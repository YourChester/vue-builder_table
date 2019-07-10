import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'notification',
})
export default class Notification extends Vue {
  get storeState() {
    return this.$store.getters['state/STATES'];
  }

  set storeState(value) {
    this.$store.commit('state/CHANGE_STATE', value);
  }
}
