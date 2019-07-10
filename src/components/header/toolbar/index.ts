import { Component, Vue } from 'vue-property-decorator';
import Notifications from '@/components/header/notifications/Notifications.vue';

@Component({
  name: 'toolbar',
  components: { Notifications },
})
export default class Toolbar extends Vue {
  get env() {
    try {
      return process.env;
    } catch (e) {
      return {};
    }
  }

  get storeState() {
    return this.$store.getters['state/STATES'];
  }

  set storeState(value) {
    this.$store.commit('state/CHANGE_STATE', value);
  }
}
