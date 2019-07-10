import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import ChangeDialog from '@/views/admin/dataModel/change/Dialog.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
  name: 'dataModel',
  components: { Toolbar, ChangeDialog, ConfirmDialog, InfiniteLoading },
})
export default class DataModel extends Vue {
  public headers: object[] = [
    {
      text: 'Название',
      value: 'name',
      sortable: false,
    },
    {
      text: '',
      sortable: false,
      width: '2%',
    },
  ];

  public payload: any = {
    page: 0,
    search: '',
    size: 20,
  };

  public infiniteId: number = +new Date();

  public items: object[] = [];

  public removeDialogActive: boolean = false;

  public selectedModel: any = null;

  public created() {
    this.initItemsData();

    this.$EventBus.$on('UPDATE_DATA_MODEL_LIST', () => {
      this.initItemsData();
    });
  }

  public beforeDestroy() {
    this.$EventBus.$off('UPDATE_DATA_MODEL_LIST');
  }

  public deleteModel(item: any) {
    this.selectedModel = item;
    this.changeDeleteDialogState(true);
  }

  public async deleteCallback() {
    try {
      await this.$API.object.class.delete(this.selectedModel.id);

      this.selectedModel = null;
      this.changeDeleteDialogState(false);
      this.initItemsData();
    } catch (e) {}
  }

  public changeDeleteDialogState(state: boolean) {
    this.removeDialogActive = state;
  }

  public async initItemsData() {
    this.items = [];
    this.infiniteId = +new Date();
  }

  public async infiniteHandler($state: any) {
    try {
      const result = await this.$API.object.class.list(this.payload);
      this.items = this.$_.concat(
        this.items,
        this.$_.get(result, 'data.content', []),
      );

      if (!this.$_.get(result, 'data.last')) {
        this.payload.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }
    } catch (e) {
      $state.complete();
    }
  }

  public openDialog(val: number) {
    const id: any = val;
    this.$router.push({ name: 'dataModelForm', params: { id } });
  }
}
