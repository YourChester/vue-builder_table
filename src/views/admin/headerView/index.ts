import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
  name: 'dataModel',
  components: { Toolbar, ConfirmDialog, InfiniteLoading },
})
export default class DataView extends Vue {
  public headers = [
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
  public items = [];

  public infiniteId: number = +new Date();

  public removeDialogActive: boolean = false;

  public selectedModel: any = null;

  public errorMsg: string = '';

  public props: any = {
    type: 'LIST',
    size: 20,
    page: 0,
  };

  public created() {
    this.initItemsData();
  }

  public async initItemsData() {
    try {
      this.errorMsg = '';
      this.items = [];
      this.infiniteId = +new Date();
    } catch (e) {
      this.errorMsg = this.$_.get(e, 'message');
    }
  }

  public deleteModel(item: any) {
    this.selectedModel = item;
    this.changeDeleteDialogState(true);
  }

  public async deleteCallback() {
    try {
      this.errorMsg = '';
      await this.$API.object.view.delete(this.selectedModel.id);
      this.$EventBus.$emit('UPDATE_VIEW');
      this.selectedModel = null;
      this.changeDeleteDialogState(false);
      this.initItemsData();
    } catch (e) {
      this.errorMsg = this.$_.get(e, 'message');
    }
  }

  public changeDeleteDialogState(state: boolean) {
    this.removeDialogActive = state;
  }

  public openDialog(val: number) {
    const id: any = val;
    this.$router.push({ name: 'headerModelView', params: { id } });
  }

  public goToCard() {
    this.$router.push({ name: 'headerModelViewAdd' });
  }

  public async infiniteHandler($state: any) {
    try {
      const result = await this.$API.object.view.list(this.props);
      this.items = this.$_.concat(
        this.items,
        this.$_.get(result, 'data.content', []),
      );

      if (!this.$_.get(result, 'data.last')) {
        this.props.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }
    } catch (e) {
      $state.complete();
      this.errorMsg = this.$_.get(e, 'message');
    }
  }
}
