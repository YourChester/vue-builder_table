import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';

@Component({
  name: 'historyDialog',
  components: {
    InfiniteLoading,
  },
})
export default class HistoryDialog extends Vue {
  public id: number = 0;

  @Prop({ default: false }) public dialog!: boolean;

  @Prop() public getData!: any;

  @Prop() public getIndex!: any;

  public infiniteId: number = +new Date();

  public index: number = 0;

  public historyData: any[] = [];

  public formattedHistoryData: any[] = [];

  public openDialog: boolean = this.dialog;

  public totalElement: number = 0;

  public props: any = {
    objectCard: 0,
    page: 0,
    search: '',
    size: 25,
  };

  @Watch('dialog')
  public onDialog(val: boolean) {
    if (val) {
      this.openDialog = val;
      this.id = this.getData;
      this.infiniteId = +new Date();
    } else {
      this.openDialog = false;
      this.historyData = [];
      this.formattedHistoryData = [];
      this.id = 0;
    }
  }

  public async created() {
    this.id = this.getData;
    this.infiniteId = +new Date();
  }

  public async infiniteHandler($state: any) {
    try {
      this.props.objectCard = this.getData;

      const results = await this.$API.object.values.history(this.props);

      if (!this.$_.get(results, 'data.last')) {
        this.props.page += 1;
        this.totalElement = this.$_.get(results, 'data.totalElements');
        const p = this.$_.get(results, 'data.content');
        for (let i = 0; i < p.length; i += 1) {
          this.historyData.push(p[i]);
        }
        $state.loaded();
      } else {
        this.totalElement = this.$_.get(results, 'data.totalElements');
        const p = this.$_.get(results, 'data.content');
        for (let i = 0; i < p.length; i += 1) {
          this.historyData.push(p[i]);
        }
        $state.complete();
      }
      if (this.historyData.length) {
        this.formArray();
      }
    } catch (e) {
      $state.complete();
    }
  }

  public async getHistory() {
    const id = this.getData;
    const payload = {
      objectCard: id,
      page: 0,
      search: '',
      size: 500,
    };
    const result = await this.$API.object.values.history(payload);
    this.historyData = result.data.content;
    if (this.historyData.length) {
      this.formArray();
    }
  }

  public checkForBlankValue(val: any) {
    if (val) {
      const type = typeof val;
      const data = [];
      if (type === 'object' && val.length) {
        for (const item of val) {
          data.push(item.originalName);
        }
        const field = data.join(', ');
        return `c "${field}"`;
      } else if (type === 'string') {
        return `c "${val}"`;
      }
    }
  }

  public formatForFieldData(val: any) {
    const type = typeof val;
    const data = [];
    if (type === 'object') {
      for (const item of val) {
        data.push(item.originalName);
      }
      const field = data.join(', ');
      return `"${field}"`;
    } else if (type === 'string') {
      return `"${val}"`;
    }
  }

  public async formArray() {
    try {
      const formArray: any[] = [];
      for (const item of this.historyData) {
        const card = this.$_.get(item, 'card.fields');
        const user = this.$_.get(item, 'user');
        const date = this.$Moment
          .unix(this.$_.get(item, 'envelope.dateEdit'))
          .format('DD.MM.YYYY HH:mm');
        const fields: any = [];
        const vm = this;

        if (this.$_.get(item, 'diff') && this.$_.get(item, 'values')) {
          this.$_.forEach(this.$_.get(item, 'diff'), (value: any, key: any) => {
            if (value && key) {
              const fieldKey = key;
              let newValue = value;
              const oldField = vm.$_.find(card, { key: fieldKey });
              const name = this.$_.get(oldField, 'name', '');
              let oldValue = this.$_.get(item, 'values.' + fieldKey);

              if (this.$_.get(oldField, 'type') === 'DATE') {
                newValue = this.$Moment.unix(newValue).format('DD.MM.YYYY');
                oldValue = this.$Moment.unix(oldValue).format('DD.MM.YYYY');
              }
              const payloadForFields = {
                name,
                newValue,
                oldValue,
              };
              fields.push(payloadForFields);
            }
          });

          if (this.$_.get(fields, 'length')) {
            const payloadForArray: any = {
              user,
              date,
              fields,
              cardCreate: false,
            };
            formArray.push(payloadForArray);
          }
        } else if (this.$_.get(item, 'diff') && !this.$_.get(item, 'values')) {
          this.$_.forEach(this.$_.get(item, 'diff'), (value: any, key: any) => {
            if (value) {
              if (
                key !== 'id' &&
                key !== 'user' &&
                key !== 'dateEdit' &&
                key !== 'dateOpen' &&
                key !== 'dateClose'
              ) {
                const fieldKey = key;
                let newValue = value;
                const oldField = vm.$_.find(card, { key: fieldKey });

                const name = this.$_.get(oldField, 'name', '');
                if (!name) {
                  return;
                }

                if (this.$_.get(oldField, 'type') === 'DATE') {
                  newValue = this.$Moment.unix(newValue).format('DD.MM.YYYY');
                }

                if (this.$_.get(newValue, 'length') === 0) {
                  newValue = '';
                }

                if (newValue !== '') {
                  const payloadForFields = {
                    name,
                    newValue,
                  };
                  fields.push(payloadForFields);
                }
              }
            }
          });

          if (this.$_.get(fields, 'length')) {
            const payloadForArray: any = {
              user,
              date,
              fields,
              cardCreate: true,
            };
            formArray.push(payloadForArray);
          }
        }
      }
      this.formattedHistoryData = formArray;
    } catch (e) {}
  }

  public cancelDialog() {
    this.$emit('cancelDialog');
  }
}
