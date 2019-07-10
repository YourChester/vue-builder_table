import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataViewForm from '@/views/admin/dataView/form/Form.vue';
import DataRulesFormDialog from '@/views/admin/dataRules/form/dialog/Dialog.vue';

@Component({
  name: 'dataRulesFormFieldDialog',
  components: { Toolbar, DataViewForm, DataRulesFormDialog },
})
export default class DataRulesFormFieldDialog extends Vue {
  public id: number = 0;

  @Prop({ default: false }) public dialog!: boolean;

  @Prop({ default: false }) public add!: boolean;

  @Prop() public getData!: any;

  @Prop() public getIndex!: any;

  public items: object[] = [];

  public openDialog: boolean = this.dialog;

  public newIndex: number = -1;

  public newAdd: boolean = false;

  public openRuleSettings: boolean = false;

  public actionData: object[] = [
    { text: 'ADD' },
    { text: 'EDIT' },
    { text: 'DELETE' },
    { text: 'VIEW' },
  ];

  public roleData: object[] = [
    { id: 1, text: 'Админ' },
    { id: 2, text: 'Юзер' },
  ];

  public data: any[] = [];

  @Watch('dialog')
  public onDialog(val: boolean) {
    if (val) {
      this.openDialog = val;
      this.data = this.$_.cloneDeep(this.getData);
      if (this.data[this.getIndex].rules) {
        this.items = this.data[this.getIndex].rules;
      }
    } else {
      this.openDialog = false;
      this.items = [];
      this.data = [];
      this.newIndex = -1;
      this.newAdd = false;
    }
  }

  @Watch('pattern')
  public onPattern(val: object[]) {
    this.data[this.getIndex] = val;
  }

  public saveDialog() {
    this.$emit('saveDialog', this.items, this.getIndex);
  }

  public addRule() {
    this.items.push({
      name: '',
      action: [],
      role: [],
      json: '',
      public: false,
    });
    const val = this.items.length - 1;
    this.newIndex = val;
    this.openRuleSettings = true;
    this.newAdd = true;
  }

  public saveField(val: any) {
    if (this.add) {
      this.$API.object.field.add(val);
    } else {
      this.$API.object.field.edit(val);
    }
  }

  public openRuleSettingsDialog(val: number) {
    this.newIndex = val;
    this.openRuleSettings = true;
    this.newAdd = false;
  }

  public saveRuleDialog(val: any) {
    this.items = val;
    this.newIndex = -1;
    this.openRuleSettings = false;
    this.newAdd = false;
  }

  public cancelRuleDialog() {
    this.newIndex = -1;
    this.openRuleSettings = false;
    this.newAdd = false;
  }

  public deleteField(index: number) {
    this.items.splice(index, 1);
  }

  public cancelDialog() {
    this.$emit('cancelDialog');
  }
}
