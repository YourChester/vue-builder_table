import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'notifications',
})
export default class Notifications extends Vue {
  public loading: any = {};

  get notificationCount() {
    return this.$store.getters['notification/COUNT'];
  }
  set notificationCount(val: any) {}

  get notificationList() {
    return this.$store.getters['notification/LIST'];
  }

  public created() {
    this.init();
  }

  public async init() {
    const result = await this.$store.dispatch('notification/SET_COUNT');

    if (this.$_.get(result, 'response.data.count')) {
      this.$store.dispatch('notification/SET_LIST');
    }
  }

  public async deleteNotification(id: string) {
    try {
      this.$set(this.loading, id, true);
      await this.$store.dispatch('notification/DELETE_ITEM_IN_LIST', id);
    } catch (e) {
      this.$store.dispatch(
        'state/VIEW_NOTIFICATION',
        this.$_.get(e, 'message'),
      );
    } finally {
      this.$set(this.loading, id, false);
    }
  }
}
