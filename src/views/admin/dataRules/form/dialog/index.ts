import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataViewForm from '@/views/admin/dataView/form/Form.vue';

@Component({
  name: 'dataRulesFormDialog',
  components: { Toolbar, DataViewForm, editor: require('vue2-ace-editor') },
})
export default class DataRulesFormDialog extends Vue {
  public id: number = 0;

  public patternData: object[] = [
    {
      name: 'Второе',
      action: ['EDIT'],
      role: [2],
      json: '',
      public: true,
    },
  ];

  public pattern: object = {};

  @Prop({ default: false }) public dialog!: boolean;

  @Prop({ default: false }) public add!: boolean;

  @Prop() public getData!: any;

  @Prop() public getIndex!: any;

  public index: number = 0;

  public openDialog: boolean = this.dialog;

  public rulesOperatorSelect: object[] = [
    { value: 'and', text: 'И' },
    { value: 'or', text: 'ИЛИ' },
  ];

  public rulesForAnd: object[] = [
    { type: 'in', target: 'correspondents', value: '15' },
    { type: 'equals', target: 'id', value: '17' },
  ];

  public rulesForOr: object[] = [
    { type: 'like', target: 'creator', value: 'vast' },
  ];

  public typeForRules: object[] = [
    { value: 'equals', text: 'equals' },
    { value: 'in', text: 'in' },
    { value: 'like', text: 'like' },
  ];

  public targetForRules: object[] = [
    { value: 'correspondents', text: 'correspondents' },
    { value: 'id', text: 'id' },
    { value: 'creator', text: 'creator' },
  ];

  public typeItemsFile: object[] = [{ id: null, text: 'Его нет' }];

  public actionData: object[] = [
    { text: 'ADD' },
    { text: 'EDIT' },
    { text: 'DELETE' },
    { text: 'VIEW' },
    { text: 'SAVE' },
    { text: 'EDIT_VALUE' },
    { text: 'DELETE_VALUE' },
    { text: 'VIEW_VALUE' },
    { text: 'ADD_LIST' },
    { text: 'EDIT_LIST' },
  ];

  public roleData: object[] = [];

  public data: any[] = [];

  @Watch('dialog')
  public onDialog(val: boolean) {
    if (val) {
      this.openDialog = val;
      this.data = this.$_.cloneDeep(this.getData);
      this.index = this.$_.cloneDeep(this.getIndex);
      if (!this.data[this.getIndex].json) {
        this.data[this.getIndex].json = '{}';
      }
      if (!this.data[this.getIndex].json2) {
        this.data[this.getIndex].json2 = '{}';
      }
      this.initRoleData();
    } else {
      this.openDialog = false;
      this.roleData = [];
      this.data = [
        {
          json: '',
          json2: '',
        },
      ];
      this.index = 0;
      this.pattern = {};
    }
  }

  @Watch('pattern')
  public onPattern(val: object[]) {
    this.data[this.getIndex] = val;
  }

  public async initRoleData() {
    const payload = {};
    const result = await this.$API.roles.list(payload);
    this.roleData = result.data;
  }

  public saveDialog() {
    for (const item of this.data) {
      if (item.name === '') {
        const actions = item.actions.join(', ');
        const roles: any = this.getRolesForName(item.roles);
        const rolesToString = roles.join(', ');
        item.name = `${rolesToString} - ${actions}`;
      }
    }
    this.$emit('saveDialog', this.data);
  }

  public getRolesForName(val: any) {
    const data = [];
    for (const item of val) {
      if (this.$_.find(this.roleData, ['id', item])) {
        const dataForName = this.$_.find(this.roleData, ['id', item]);
        const name = dataForName.name;
        data.push(name);
      }
    }
    return data;
  }

  public async saveField(val: any) {
    try {
      if (this.add) {
        await this.$API.object.field.add(val);
        this.$store.dispatch('state/VIEW_NOTIFICATION', `Поле сохранено`);
      } else {
        await this.$API.object.field.edit(val);
        this.$store.dispatch('state/VIEW_NOTIFICATION', `Поле сохранено`);
      }
    } catch (e) {
      this.$store.dispatch('state/VIEW_NOTIFICATION', `${e.message}`);
    }
  }

  public editorInit() {
    require('brace/ext/language_tools'); // language extension prerequsite...
    require('brace/mode/html');
    require('brace/mode/json');
    require('brace/mode/javascript'); // language
    require('brace/mode/less');
    require('brace/theme/chrome');
    require('brace/snippets/javascript');
    require('brace/snippets/json'); // snippet
  }

  public cancelDialog() {
    this.$emit('cancelDialog');
  }
}
