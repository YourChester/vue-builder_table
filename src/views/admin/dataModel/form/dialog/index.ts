import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataViewForm from '@/views/admin/dataView/form/Form.vue';

interface SchemaItems {
  name: string;
  type: string;
  isMandatory: boolean;
}

@Component({
  name: 'dataModelFormDialog',
  components: { Toolbar, DataViewForm, editor: require('vue2-ace-editor') },
})
export default class DataModelFormDialog extends Vue {
  public id: number = 0;

  public activeTabs: number = 0;

  public specialIndex: number = 0;

  public $refs!: any;

  public rules: any = {
    latinOnly: (value: any) =>
      !!value.match(/^([_0-9a-z\s]*)$/g) ||
      'Только латинские буквы, цифры и \'_\'.',
    required: (value: any) => !!value || 'Обязательное поле.',
  };

  public typeItemsListTextField: object[] = [];

  public typeItemsListFileField: object[] = [];

  public dialogModelTemp: object[] = [{}];

  @Prop({ default: false }) public dialog!: boolean;

  @Prop({ default: false }) public add!: boolean;

  @Prop() public schemaItemsProp!: any;

  @Prop() public typeItemsProp!: any;

  @Prop() public specialIndexProp!: any;

  public openSpecialSettingsDialog: boolean = this.dialog;

  public typeItemsFile: object[] = [{ id: null, text: 'Его нет' }];

  public typeItemsText: object[] = [
    { value: 'long', text: 'Длинный' },
    { value: 'short', text: 'Короткий' },
  ];

  public typeItemsList: object[] = [
    { value: 'select', text: 'Список' },
    { value: 'autocomplete', text: 'Автодополнение' },
    { value: 'comments', text: 'Комментарии' },
    { value: 'chat', text: 'Чаты' },
    { value: 'user', text: 'Пользователи' },
    { value: 'group', text: 'Группы' },
    { value: 'file', text: 'Файлы' },
  ];

  public typeItemsListSrc: object[] = [];

  public newSchemaItems: any[] = [];

  public typeItemsValues: object[] = [];

  public typeItems: object[] = [];

  public typeItemsRoles: object[] = [];

  public typeItemsFields: object[] = [];

  public viewListSrc: boolean = true;

  public typeItemsListField: any = [];

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

  public changeViewSrc(specialIndex: number, id: any, type: any) {
    try {
      this.newSchemaItems[specialIndex].props.object.user = false;
      this.newSchemaItems[specialIndex].props.object.group = false;
      this.newSchemaItems[specialIndex].props.object.multiple = false;
      this.viewListSrc = true;

      switch (this.newSchemaItems[specialIndex].props.type) {
        case 'user':
          this.viewListSrc = false;
          this.newSchemaItems[specialIndex].props.object.group = false;
          this.newSchemaItems[specialIndex].props.object.user = true;
          break;

        case 'group':
          this.viewListSrc = false;
          this.newSchemaItems[specialIndex].props.object.group = true;
          this.newSchemaItems[specialIndex].props.object.user = false;
          break;

        case 'file':
          this.newSchemaItems[specialIndex].props.object.multiple = true;
          break;

        default:
          break;
      }

      this.changeTypeItemsListSrc(specialIndex, id, type);
    } catch (e) {}
  }

  @Watch('dialog')
  public onDialog(val: boolean) {
    if (val) {
      this.openSpecialSettingsDialog = val;
      const data = this.$_.cloneDeep(this.schemaItemsProp);
      this.specialIndex = this.$_.cloneDeep(this.specialIndexProp);
      this.newSchemaItems = this.$_.cloneDeep(data);
      this.typeItems = this.$_.cloneDeep(this.typeItemsProp);
      this.getModelList();
      this.initRoleData();
      this.initFieldsData();

      if (this.newSchemaItems[this.specialIndex].props.object) {
        this.getTypeItemsListField(
          this.$_.get(
            this.newSchemaItems,
            this.specialIndex + '.props.object.reference',
          ),
          this.$_.get(this.newSchemaItems, this.specialIndex + '.props.type'),
        );
      } else {
        this.newSchemaItems[this.specialIndex].props.object = {
          multiple: null,
          textField: null,
          fileField: null,
          kostil: false,
          user: false,
          group: false,
          versioning: true,
          validated: false,
          cascade: false,
          cascadeSave: false,
        };
      }
      if (!this.newSchemaItems[this.specialIndex].props.history) {
        this.newSchemaItems[this.specialIndex].props.history = [];
      }
      if (!this.newSchemaItems[this.specialIndex].props.divider) {
        this.newSchemaItems[this.specialIndex].props.divider = {
          key: null,
          value: null,
        };
      }
    } else {
      this.openSpecialSettingsDialog = false;
      this.specialIndex = -1;
      this.newSchemaItems = [];
      this.typeItems = [];
    }
  }

  @Watch('$route', { immediate: true, deep: true })
  public onRouteParams(val: any) {
    this.id = this.$_.get(val.params, 'id');
  }

  public async getModelList() {
    try {
      const payload = {
        page: 0,
        search: '',
        size: 500,
      };

      const result = await this.$API.object.class.list(payload);
      const data = this.$_.get(result.data, 'content', []);
      data.unshift({ id: null, name: '- Не выбрано -' });
      this.typeItemsListSrc = data;
    } catch (e) {}
  }

  public async initItemsValues(obj: any) {
    const id = obj.props.object.reference;
    const payload = {
      objectClass: id,
      page: 0,
      size: 500,
    };

    const result = await this.$API.object.values.list(payload);
    this.typeItemsValues = result.data.content;
    this.newSchemaItems[this.specialIndex].props.divider.key = obj.id;
  }

  public async initFieldsData() {
    const payload = {
      objectClassId: this.id,
      page: 0,
      search: '',
      size: 500,
    };
    const result = await this.$API.object.field.list(payload);
    const data = result.data.content;
    for (const item of data) {
      if (item.props.object.versioning) {
        this.typeItemsFields.push(item);
      }
    }
    if (this.newSchemaItems[this.specialIndex].props.divider.key) {
      const iden = this.newSchemaItems[this.specialIndex].props.divider.key;
      const dataForField = this.$_.find(this.typeItemsFields, ['id', iden]);
      const payloadForItems = dataForField;
      this.initItemsValues(payloadForItems);
    }
  }

  public async initRoleData() {
    const payload = {};
    const result = await this.$API.roles.list(payload);
    this.typeItemsRoles = result.data;
  }

  public addRuleForHistory() {
    const payload = {
      roles: [],
      json: '{}',
    };
    this.newSchemaItems[this.specialIndex].props.history.push(payload);
    this.$forceUpdate();
  }

  public deleteRuleForHistory(index: number) {
    this.newSchemaItems[this.specialIndex].props.history.splice(index, 1);
  }

  public async getTypeItemsListField(id: number, type: string) {
    try {
      let fieldType: string = '';

      switch (this.$_.toUpper(type)) {
        case 'FILE':
          fieldType = 'FILE';
          break;
        default:
          fieldType = 'STRING';
          break;
      }

      const payload = {
        objectClassId: id,
        page: 0,
        search: '',
        size: 500,
      };

      const result = await this.$API.object.field.list(payload);

      this.typeItemsListField = this.$_.filter(
        result.data.content,
        (el: any) => this.$_.get(el, 'type') === fieldType,
      );
    } catch (e) {}
  }

  public changeTypeItemsListSrc(specialIndex: any, id: any, type: any) {
    try {
      this.newSchemaItems[specialIndex].props.object.fileField = null;
      this.newSchemaItems[specialIndex].props.object.textField = null;

      this.getTypeItemsListField(id, type);
    } catch (e) {}
  }

  public saveDialog() {
    if (this.$refs.form.validate()) {
      this.saveField(this.newSchemaItems[this.specialIndex]);
    }
  }

  public async saveField(val: any) {
    try {
      if (this.add) {
        const result = await this.$API.object.field.add(val);
        this.newSchemaItems[this.specialIndex] = result.data;
        this.$emit('saveDialog', this.newSchemaItems);
        this.$store.dispatch('state/VIEW_NOTIFICATION', `Поле сохранено`);
      } else {
        const result = await this.$API.object.field.edit(val);
        this.newSchemaItems[this.specialIndex] = result.data;
        this.$emit('saveDialog', this.newSchemaItems);
        this.$store.dispatch('state/VIEW_NOTIFICATION', `Поле сохранено`);
      }
    } catch (e) {
      this.$store.dispatch('state/VIEW_NOTIFICATION', `${e.message}`);
    }
  }

  public cancelDialog() {
    this.$emit('cancelDialog');
  }
}
