import { Component, Vue, Watch } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import DataViewForm from '@/views/admin/dataView/form/Form.vue';
import DataModelFormDialog from '@/views/admin/dataModel/form/dialog/Dialog.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';

interface SchemaItems {
  id?: number;
  key: string;
  name: string;
  objectClass: number;
  props: {
    object: {
      multiple?: boolean | null;
      reference?: number | null;
      textField?: string | null;
    };
    required?: boolean | null;
    src?: number | null;
    type?: string | null;
  };
  type: string;
}

@Component({
  name: 'dataModelForm',
  components: { Toolbar, DataViewForm, DataModelFormDialog, ConfirmDialog },
})
export default class DataModelForm extends Vue {
  public id: number = 0;

  public objectClass: any = {};

  public deleteIndex: number = -1;

  public activeTabs: number = 0;

  public addField: boolean = false;

  public specialIndex: number = -1;

  public title: string = 'Вы действительно хотите удалить поле?';

  public removeDialogActive: boolean = false;

  public openSpecialSettingsDialog: boolean = false;

  public dialogModelTemp: object[] = [{}];

  public schemaItems: SchemaItems[] = [];

  public typeItems: object[] = [];

  public addItem() {
    this.schemaItems.push({
      key: '',
      name: '',
      objectClass: this.id,
      props: {
        object: {
          multiple: null,
          reference: null,
          textField: null,
        },
        required: null,
        type: null,
      },
      type: '',
    });
    const val = this.schemaItems.length - 1;
    this.specialIndex = val;
    this.openSpecialSettingsDialog = true;
    this.addField = true;
  }

  public async deleteFieldFinal() {
    try {
      const index = this.deleteIndex;
      const id = this.schemaItems[index].id;
      await this.$API.object.field.delete(id);
      this.schemaItems.splice(index, 1);
      this.removeDialogActive = false;
    } catch (e) {
      this.$store.dispatch('state/VIEW_NOTIFICATION', `${e.message}`);
    }
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
    this.id = this.$_.get(this.$router.currentRoute.params, 'id');

    this.initObjectClass();
    this.initItemsData();
    this.initTypesData();
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

  public async initTypesData() {
    const result = await this.$API.object.field.types();
    this.typeItems = result.data;
  }

  public onCancelDialog() {
    this.specialIndex = -1;
    this.openSpecialSettingsDialog = false;
    this.addField = false;
  }

  public onSaveDialog(forSchemaItems: any) {
    this.schemaItems = forSchemaItems;
    this.specialIndex = -1;
    this.openSpecialSettingsDialog = false;
    this.addField = false;
  }

  public openSpecialSettings(val: any, item: any) {
    if (item.key) {
      this.addField = false;
    } else {
      this.addField = true;
    }
    this.specialIndex = val;
    this.openSpecialSettingsDialog = true;
  }
}
