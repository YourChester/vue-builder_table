import { Component, Vue, Watch } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataViewForm from '@/views/admin/dataView/form/Form.vue';
import DataRulesFormDialog from '@/views/admin/dataRules/form/dialog/Dialog.vue';
import DataRulesFormFieldDialog from '@/views/admin/dataRules/form/fieldDialog/FieldDialog.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';
import { timingSafeEqual } from 'crypto';

interface SchemaItems {
  name: string;
  type: string;
  isMandatory: boolean;
}

@Component({
  name: 'dataRulesForm',
  components: {
    Toolbar,
    DataViewForm,
    DataRulesFormDialog,
    ConfirmDialog,
    DataRulesFormFieldDialog,
  },
})
export default class DataRulesForm extends Vue {
  public id: number = 0;

  public deleteIndex: number = -1;

  public activeTabs: number = 0;

  public openRuleFieldSettings: boolean = false;

  public add: boolean = false;

  public addField: boolean = false;

  public getIndex: number = -1;

  public title: string = 'Вы действительно хотите удалить поле?';

  public removeDialogActive: boolean = false;

  public openRuleSettings: boolean = false;

  public dialogModelTemp: object[] = [{}];

  public schemaItems: any[] = [];

  public typeItems: object[] = [];

  public fields: any[] = [];

  public rulesItems: object[] = [];

  public roleItems: object[] = [
    {
      value: 'no',
      text: 'их нет',
    },
  ];

  public objectClass: any = {};

  @Watch('$route', { immediate: true, deep: true })
  public onRouteParams(val: any) {
    this.id = Number(this.$_.get(val.params, 'id'));
  }

  public addRule() {
    this.rulesItems.push({
      name: '',
      action: [],
      role: [],
      json: '',
      public: false,
    });
    const val = this.rulesItems.length - 1;
    this.getIndex = val;
    this.openRuleSettings = true;
    this.add = true;
  }

  public deleteFieldFinal() {
    const index = this.deleteIndex;
    this.rulesItems.splice(index, 1);
    this.removeDialogActive = false;
  }

  public deleteField(index: number) {
    this.deleteIndex = index;
    this.removeDialogActive = true;
  }

  public deleteFieldUndo() {
    this.removeDialogActive = false;
    this.deleteIndex = -1;
  }

  public created() {
    this.initObjectClass();
    this.initItemsData();
    this.initTypesData();
    this.initRulesData();
  }

  public async initObjectClass() {
    try {
      const result = await this.$API.object.class.get(this.id);
      this.objectClass = result.data;
    } catch (e) {}
  }

  public async initItemsData() {
    const payload = {
      objectClassId: this.id,
      page: 0,
      search: '',
      size: 500,
    };
    const result = await this.$API.object.field.list(payload);
    this.schemaItems = result.data.content;
  }

  public async initRulesData() {
    const payload = this.id;
    const result = await this.$API.object.rules.get(payload);
    this.rulesItems = result.data.rules;
    this.initRulesForFields(result.data);
  }

  public initRulesForFields(val: any) {
    const data = val.fields;

    for (const item of data) {
      const value = this.$_.findIndex(this.schemaItems, { id: item.id });
      if (value !== -1) {
        // const value = this.$_.findIndex(this.schemaItems, { id: item.id });
        this.schemaItems[value].rules = item.rules;
      }
    }
  }

  public async initTypesData() {
    const result = await this.$API.object.field.types();
    this.typeItems = result.data;
  }

  public onCancelDialog() {
    this.getIndex = -1;
    this.openRuleSettings = false;
    this.addField = false;
  }

  public onSaveDialog(forSchemaItems: any) {
    this.schemaItems = forSchemaItems;
    this.getIndex = -1;
    this.openRuleSettings = false;
    this.addField = false;
  }

  public saveRuleDialog(val: any) {
    this.openRuleSettings = false;
    this.getIndex = -1;
    this.rulesItems = val;
  }

  public saveRuleFieldDialog(val: any, index: number) {
    this.schemaItems[index].rules = val;
    this.openRuleFieldSettings = false;
    this.getIndex = -1;
  }

  public cancelRuleDialog() {
    this.openRuleSettings = false;
    this.getIndex = -1;
  }

  public cancelRuleFieldDialog() {
    this.openRuleFieldSettings = false;
    this.getIndex = -1;
  }

  public async save() {
    try {
      for (const item of this.schemaItems) {
        if (!this.$_.find(this.fields, { id: item.id })) {
          if (item.rules) {
            const data = {
              id: item.id,
              rules: item.rules,
            };
            this.fields.push(data);
          }
        } else {
          const index = this.$_.findIndex(this.fields, { id: item.id });
          this.fields[index].rules = item.rules;
        }
      }

      const payload = {
        id: this.id,
        rules: this.rulesItems,
        fields: this.fields,
      };
      await this.$API.object.rules.add(payload);

      this.$EventBus.$emit('UPDATE_VIEW');
      this.$store.dispatch('state/VIEW_NOTIFICATION', `Правила сохранены`);
    } catch (e) {
      this.$store.dispatch('state/VIEW_NOTIFICATION', `${e.message}`);
    }
  }

  public openRuleSettingsDialog(val: any) {
    this.getIndex = val;
    this.openRuleSettings = true;
    this.addField = false;
  }

  public openFieldRuleSettings(val: any) {
    this.getIndex = val;
    this.openRuleFieldSettings = true;
  }
}
