import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import VueGridLayout from 'vue-grid-layout';

@Component({
  name: 'dataModelForm',
  components: {
    Toolbar,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
})
export default class DataModelForm extends Vue {
  public id: number = 0;

  public num: number = 1;

  public x: number = 0;

  public y: number = 0;

  public firstAdd: boolean = false;

  public snackbar: boolean = false;

  public loading: boolean = false;

  public showMenu: boolean[] = [];

  public fields: any = [];

  public selectedField: any = {};

  public layout: any = [];

  public classList: any = [];

  public objectClass: any = {};

  public objectClassId: number = 0;

  public errorMsg: string = '';

  public schemaName: string = '';

  public created() {
    if (this.$_.get(this.$router.currentRoute, 'params.id')) {
      this.id = this.$_.get(this.$router.currentRoute, 'params.id');
      this.getClassList();
      this.initObjectClass();
      this.firstAdd = false;
    } else {
      this.getClassList();
      this.firstAdd = true;
    }
  }

  public async getClassList() {
    const payload = {
      page: 0,
      search: '',
      size: 500,
    };
    const result = await this.$API.object.class.list(payload);
    this.classList = this.$_.get(result, 'data.content');
  }

  public async getFields() {
    const data = {
      objectClassId: this.objectClassId,
      size: 500,
    };
    const result = await this.$API.object.field.list(data);
    this.fields = result.data.content;
    this.addCustomFields();
  }

  public async initObjectClass() {
    try {
      const resultView = await this.$API.object.view.get(this.id);
      this.objectClassId = resultView.data.objectClass;
      this.schemaName = resultView.data.props.name;
      const result = await this.$API.object.class.get(this.objectClassId);
      this.objectClass = result.data;
      this.initItemsData();
    } catch (e) {}
  }

  public async initItemsData() {
    const payload = {
      objectClassId: this.objectClassId,
      page: 0,
      search: '',
      size: 500,
    };
    const result = await this.$API.object.field.list(payload);
    this.fields = result.data.content;
    this.initLayoutData();
    this.addCustomFields();
  }

  public addCustomFields() {
    this.fields.push({
      id: -1,
      name: 'Кнопка: сохранить объект',
      type: 'CUSTOM_FIELD',
      props: {
        type: 'button',
        action: 'save_form',
        value: 'Сохранить',
      },
    });
    this.fields.push({
      id: -2,
      name: 'Информация об объекте',
      type: 'CUSTOM_FIELD',
      props: {
        type: 'card_info',
      },
    });
  }

  public async initLayoutData() {
    const payload = {
      size: 1,
      objectClassId: this.objectClassId,
      type: 'CARD',
    };

    const result = await this.$API.object.view.list(payload);
    const data = result.data.content;

    this.layout = this.$_.get(data, '0.props.grid', []);
    this.syncValue();
  }

  public syncValue() {
    const data = this.layout;
    for (const item of data) {
      const index = this.$_.findIndex(this.fields, { id: item.i.id });
      this.fields.splice(index, 1);
    }
  }

  public addField(item: any, index: any) {
    if (item.id) {
      const payload = {
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        i: item,
      };
      this.layout.push(payload);
      this.fields.splice(index, 1);
    }
  }

  public deleteField(item: any, index: number) {
    this.layout.splice(index, 1);
    this.fields.push(item.i);
  }

  public show(e: any, index: number) {
    e.preventDefault();
    this.showMenu[index] = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.showMenu[index] = true;
  }

  public async saveDataView() {
    try {
      this.loading = true;

      const payload = {
        props: {
          name: this.schemaName,
          grid: this.layout,
        },
        objectClass: this.objectClassId,
        id: this.id,
        objectViewType: 'CARD',
      };
      if (this.firstAdd) {
        await this.$API.object.view.add(payload);
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Представление создано',
        );
        this.$router.push({ name: 'dataView' });
      } else {
        await this.$API.object.view.edit(payload);
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Представление обновлено',
        );
      }
    } catch (e) {
      this.errorMsg = this.$_.get(e, 'error');
    } finally {
      this.loading = false;
    }
  }
}
