import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import VueGridLayout from 'vue-grid-layout';

@Component({
  name: 'dataModelForm',
  components: {
    Toolbar,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    editor: require('vue2-ace-editor'),
  },
})
export default class DataModelForm extends Vue {
  public id: number = 0;

  public jsonRaw: string = '';

  public name: string = '';

  public classList: any = [];

  public selectClass: any = [];

  public searchById: boolean = false;

  public defaultClass: any = [];

  public defaultLayout: any = [];

  public defaultLayoutFilter: any = [];

  public schemaName: any = [];

  public edit: boolean = false;

  public save: boolean = false;

  public saveOk: boolean = false;

  public activeTabs: number = 0;

  public snackbar: boolean = false;

  public snackbarFilter: boolean = false;

  public snackbarFilterText: string = '';

  public showMenu: boolean[] = [];

  public showFilterMenu: boolean[] = [];

  public x: number = 0;

  public y: number = 0;

  public fields: any = [];

  public fieldsToFilter: any = [];

  public filters: any = [];

  public layout: any = [];

  public layoutFiltr: any = [];

  public layoutFiltrDefault: any = [];

  public layoutFiltrToSave: any = [];

  public loading: boolean = false;

  public errorMsg: string = '';

  public created() {
    if (this.$router.currentRoute.name === 'headerModelViewAdd') {
      this.edit = false;
      this.getClassList();
      this.setDefaultFilters();
    } else {
      this.edit = true;
      this.id = this.$_.get(this.$router.currentRoute, 'params.id');
      this.getClassList();
      this.getDefault();
      this.fields.forEach(() => {
        this.showMenu.push(false);
      });
      this.filters.forEach(() => {
        this.showFilterMenu.push(false);
      });
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

  public async getFieldsOfClass() {
    const data = {
      objectClassId: this.selectClass,
      size: 500,
    };
    const result = await this.$API.object.field.list(data);
    this.fields = result.data.content;
    this.fieldsToFilter = this.$_.clone(this.fields);
    this.checkFields();
    this.checkFilter();
  }

  public async getDefault() {
    try {
      const result = await this.$API.object.view.get(this.id);
      // Нахождения нужной схемы с objectViewType = 'LIST'
      this.schemaName = this.$_.get(result, 'data.props.name');
      this.searchById = this.$_.get(result, 'data.props.searchById');
      this.selectClass = this.$_.get(result, 'data.objectClass');
      this.defaultClass = this.$_.get(result, 'data.objectClass');
      this.layout = this.$_.get(result, 'data.props.grid');
      this.defaultLayout = this.$_.get(result, 'data.props.grid');
      this.layoutFiltr = this.$_.get(result, 'data.props.filter');
      this.layoutFiltrDefault = this.$_.get(result, 'data.props.filter');

      this.jsonRaw = JSON.stringify(
        this.$_.get(result.data, 'props.selector', {}),
        null,
        4,
      );
      this.getFieldsOfClass();
    } catch (e) {}
  }

  public checkFields() {
    if (this.selectClass === this.defaultClass) {
      this.layout = this.$_.clone(this.defaultLayout);
      this.layout.forEach((item: any) => {
        this.fields.forEach((fild: any, index: number) => {
          if (item.i.id === fild.id) {
            this.fields.splice(index, 1);
          }
        });
      });
    } else {
      this.layout = [];
    }
  }

  public checkFilter() {
    if (this.selectClass === this.defaultClass) {
      this.setDefaultFilters();
      this.layoutFiltr = this.$_.clone(this.layoutFiltrDefault);
      this.layoutFiltr.forEach((item: any) => {
        this.filters.forEach((fild: any, index: number) => {
          if (item.i.id === fild.id) {
            this.filters.splice(index, 1);
          }
        });
      });
    } else {
      this.layoutFiltr = [];
      this.filters = [];
      this.setDefaultFilters();
    }
  }

  public setDefaultFilters() {
    this.filters = [
      {
        id: 1,
        name: 'Поиск',
        key: 'search',
      },
    ];
    this.fieldsToFilter.forEach((item: any) => {
      if (
        item.type === 'OBJECT' ||
        item.type === 'DATE' ||
        item.type === 'STRING'
      ) {
        this.filters.push(item);
      } else {
        return;
      }
    });
  }

  public addItem(item: any, index: number) {
    let spaceX = 0;
    let spaceY = 0;
    if (this.layout.length > 0) {
      this.layout.forEach((layer: any) => {
        spaceX += layer.w;
      });
      if (spaceX >= 19) {
        spaceX = 0;
        spaceY = 1;
      }
      const newObj = {
        x: spaceX,
        y: spaceY,
        w: 2,
        h: 1,
        i: {
          id: item.id,
          name: item.name,
        },
      };
      this.fields.splice(index, 1);
      this.layout.push(newObj);
    } else {
      const newObj = {
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        i: {
          id: item.id,
          name: item.name,
        },
      };
      this.fields.splice(index, 1);
      this.layout.push(newObj);
    }
  }

  public addFilterItem(item: any, index: number) {
    const newObj = {
      x: 0,
      y: 1,
      w: 1,
      h: 1,
      i: item,
    };
    this.filters.splice(index, 1);
    this.layoutFiltr.push(newObj);
  }

  public deleteItem(item: any, index: number) {
    this.fields.splice(item.id, 0, item);
    this.layout.splice(index, 1);
    this.showMenu[index] = false;
  }

  public deleteFilterItem(item: any, index: number) {
    this.filters.splice(item.id, 0, item);
    this.layoutFiltr.splice(index, 1);
    this.showFilterMenu[index] = false;
  }

  get json() {
    try {
      return JSON.parse(this.jsonRaw);
    } catch (e) {
      return {};
    }
  }

  public changeFilters() {
    const buff: any = [];
    this.layoutFiltr.forEach((item: any) => {
      if (item.i.name === 'notification' || item.i.name === 'logo') {
        return;
      } else {
        buff.push(item);
      }
      this.layoutFiltrToSave = buff;
    });
  }

  public async saveItem() {
    try {
      this.loading = true;
      const checked: any = [];

      this.layout.forEach((item: any) => {
        item.y > 0 ? checked.push(true) : checked.push(false);
      });

      if (checked.indexOf(true) !== -1) {
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Поля не стоят в одну линию!',
        );
      } else {
        this.save = true;
        if (this.edit) {
          this.changeFilters();
          const data: any = {
            id: this.id,
            props: {
              name: this.schemaName,
              grid: this.layout,
              filter: this.layoutFiltrToSave,
              selector: this.json,
              searchById: this.searchById,
            },
            objectClass: this.selectClass,
            objectViewType: 'LIST',
          };
          await this.$API.object.view.edit(data);
          this.$EventBus.$emit('UPDATE_VIEW');
        } else {
          this.changeFilters();
          const data: any = {
            props: {
              name: this.schemaName,
              grid: this.layout,
              filter: this.layoutFiltrToSave,
              selector: this.json,
              searchById: this.searchById,
            },
            objectClass: this.selectClass,
            objectViewType: 'LIST',
          };

          await this.$API.object.view.add(data);
          this.$EventBus.$emit('UPDATE_VIEW');
          this.$router.push({ name: 'headerView' });
        }
        this.save = false;
        this.saveOk = true;

        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Представление сохранено',
        );
      }
    } catch (e) {
      this.errorMsg = this.$_.get(e, 'error');
    } finally {
      this.save = false;
    }
  }

  public async saveItemFilter() {
    try {
      this.save = true;
      const checked: any = [];
      this.layoutFiltr.forEach((item: any) => {
        item.y < 2 ? checked.push(false) : checked.push(true);
      });
      if (checked.indexOf(true) === -1) {
        if (this.edit) {
          this.saveItem();
        } else {
          this.saveItem();
        }
      } else {
        this.snackbarFilterText = 'Фильтры должны стоять в две линии!';
        this.snackbarFilter = true;
      }
    } catch (e) {
    } finally {
      this.save = false;
    }
  }

  public show(e: any, index: number) {
    e.preventDefault();
    this.showMenu[index] = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.showMenu[index] = true;
  }

  public showMenuFilter(e: any, index: number) {
    e.preventDefault();
    this.showFilterMenu[index] = false;
    this.x = e.clientX;
    this.y = e.clientY;
    this.showFilterMenu[index] = true;
  }

  public validName(name: string) {
    if (name.length > 4) {
      return name.slice(0, 4) + '...';
    } else {
      return name;
    }
  }

  public editorInit() {
    require('brace/ext/language_tools');
    require('brace/mode/html');
    require('brace/mode/json');
    require('brace/mode/javascript');
    require('brace/mode/less');
    require('brace/theme/chrome');
    require('brace/snippets/javascript');
    require('brace/snippets/json');
  }
}
