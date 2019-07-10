import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
  name: 'dataModel',
  components: { Toolbar, InfiniteLoading },
})
export default class DataModel extends Vue {
  public headers: object[] = [
    {
      text: 'Название',
      value: 'name',
      sortable: false,
    },
  ];

  public infiniteId: number = +new Date();

  public payload: any = {
    page: 0,
    search: '',
    size: 20,
  };

  public items: object[] = [];

  public created() {
    this.initItemsData();
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
    this.$router.push({ name: 'dataRulesForm', params: { id } });
  }
}
