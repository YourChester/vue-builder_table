import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataTriggersDialog from '@/views/admin/dataTriggers/dialog/Dialog.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';

@Component({
  components: { Toolbar, DataTriggersDialog, ConfirmDialog },
})
export default class DataEventsForm extends Vue {
  public error: string = '';
  public items: any = [];
  public objectClass: any = null;
  public removeDialogActive: boolean = false;
  public currentItem: any = null;
  public headers: object[] = [
    {
      text: 'Название',
      value: 'name',
      sortable: false,
    },
    {
      text: '',
      width: '1%',
      sortable: false,
    },
  ];

  public created() {
    this.objectClass = {
      id: this.$_.get(this.$router.currentRoute.params, 'objectClass'),
    };

    this.initData();
    this.getList();

    this.$EventBus.$on('UPDATE_TRIGGERS_VIEW', () => {
      this.getList();
    });
  }

  public beforeDestroy() {
    this.$EventBus.$off('UPDATE_TRIGGERS_VIEW');
  }

  public deleteItem(item: any) {
    this.currentItem = item;
    this.changeDeleteDialogState(true);
  }

  public async deleteCallback() {
    try {
      this.error = '';

      await this.$API.object.trigger.delete(
        this.$_.get(this.currentItem, 'id'),
      );

      this.getList();
      this.currentItem = null;
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    } finally {
      this.changeDeleteDialogState(false);
    }
  }

  public changeDeleteDialogState(state: boolean) {
    this.removeDialogActive = state;
  }

  public async getList() {
    try {
      this.error = '';

      const result = await this.$API.object.trigger.list({
        size: 1000,
        objectClass: this.$_.get(this.objectClass, 'id'),
      });

      this.items = this.$_.get(result, 'data.content', []);
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    }
  }

  public async initData() {
    try {
      const result = await this.$API.object.class.get(
        this.$_.get(this.objectClass, 'id'),
      );

      if (result.data) {
        this.objectClass = result.data;
      }
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    }
  }
}
