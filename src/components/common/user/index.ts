import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
  name: 'common-users',
  components: {
    InfiniteLoading,
  },
})
export default class CommonUsers extends Vue {
  @Prop({ default: [] }) public selectedItems!: any;
  @Prop({ default: null }) public creator!: any;

  public infiniteId: number = +new Date();

  public list: any = [];

  public params: any = {
    search: '',
    page: 0,
    size: 100,
  };

  public created() {
    this.$EventBus.$on('COMMON_LIST_LOAD_DATA', () => {
      this.list = [];
      this.infiniteId = +new Date();
    });
  }

  public beforeDestroy() {
    this.$EventBus.$off('COMMON_LIST_LOAD_DATA');
  }

  public search() {
    this.params.page = 0;
    this.list = [];
    this.infiniteId = +new Date();
  }

  public resetSearch() {
    this.params.search = '';
    this.search();
  }

  public infiniteHandler($state: any) {
    this.params.exclude = this.$_.get(this.creator, 'id')
      ? [this.$_.get(this.creator, 'id')]
      : null;

    this.$API.users.list(this.params).then((result: any) => {
      this.list = this.list.concat(this.$_.get(result.data, 'content'));

      if (!this.$_.get(result.data, 'last')) {
        this.params.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }
    });
  }

  public itemInteraction(item: any) {
    if (
      this.$_.find(
        this.selectedItems,
        (el: any) => this.$_.get(el, 'id') === this.$_.get(item, 'id'),
      )
    ) {
      this.removeItem(item);
    } else {
      this.addItem(item);
    }
  }

  public addItem(item: any) {
    this.$emit('add-item', item);
  }

  public removeItem(item: any) {
    this.$emit('remove-item', item);
  }

  get countMembers() {
    const count = this.$_.get(this.selectedItems, 'length');
    let result = `${count} `;

    if (count === 0) {
      result = 'нет участников';
    } else if (count === 1) {
      result += 'участник';
    } else if (count > 1 && count < 5) {
      result += 'участника';
    } else if (count >= 5) {
      result += 'участников';
    }

    return result;
  }
}
