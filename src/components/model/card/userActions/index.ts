import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({
  name: 'user-actions',
})
export default class HistoryDialog extends Vue {
  public id: number = 0;

  @Prop() public getData!: any;

  @Prop() public getIndex!: any;

  @Prop() public nameOfField!: string;

  public index: number = 0;

  public historyData: any[] = [];

  public formattedHistoryData: any[] = [];

  public totalElement: number = 0;

  public async created() {
    this.id = this.getData;
    this.getHistory();
  }

  public async getHistory() {
    // const id = this.getData;
    // const payload = {
    //   objectCard: id,
    //   page: 0,
    //   search: '',
    //   size: 500,
    // };
    // const result = await this.$API.object.values.history(payload);
    // this.historyData = result.data.content;
    this.historyData = this.getData;
    for (const item of this.historyData) {
      if (item.length) {
        this.formArray(item);
      }
    }
  }

  public async formArray(val: any) {
    try {
      const formArray: any[] = [];
      for (const item of val) {
        if (item.diff) {
          const card = item.card.fields;
          const user = item.user;
          const date = this.$Moment
            .unix(item.envelope.dateEdit)
            .format('DD.MM.YYYY HH:mm');
          const fields: any = [];
          const vm = this;
          this.$_.forEach(item.diff, (value: any, key: any) => {
            if (value && key) {
              const fieldKey = key;
              const newValue = value;
              const oldField = vm.$_.find(card, { key: fieldKey });
              const name = this.$_.get(oldField, 'name');
              const oldValue = this.$_.get(item, 'values.' + fieldKey);
              const payloadForFields = {
                name,
                newValue,
                oldValue,
              };
              fields.push(payloadForFields);
            }
          });
          if (fields.length) {
            const payloadForArray: any = {
              user,
              date,
              fields,
            };
            formArray.push(payloadForArray);
          }
        }
      }
      const arrayForFormattedHistory = formArray;
      this.formattedHistoryData.push(arrayForFormattedHistory);
    } catch (e) {}
  }

  public checkForBlankValue(val: string) {
    if (val) {
      return `c "${val}"`;
    }
  }

  public cancelDialog() {
    this.$emit('cancelDialog');
  }
}
