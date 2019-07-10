import { Component, Vue, Watch } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import InfiniteLoading from 'vue-infinite-loading';
import { ContentLoader } from 'vue-content-loader';

@Component({
  name: 'UniversalList',
  components: { Toolbar, InfiniteLoading, ContentLoader },
})
export default class UniversalList extends Vue {
  public data: any = {};

  public searchById: boolean = false;

  public schema: any = [];

  public search: any = '';

  public listId: number = 0;

  public infiniteId: number = +new Date();

  public totalElement: number = 0;

  public name: string = '';

  public errorMsg: string = '';

  public objectClass: number = 0;

  public headSchema: any = [];

  public header: any[] = [];

  public filters: any[] = [];

  public openFilter: boolean = false;

  public dataHeader: any[] = [];

  public items: any[] = [];

  public fields: any[] = [];

  public dateFormatted: any = {};

  public datePickers: any = {};

  public addSucces: boolean = false;

  public objects: any = {};

  public props: any = {
    id: 0,
    objectClass: 0,
    page: 0,
    size: 20,
    values: {
      search: '',
      id: null,
    },
  };

  public loadingMoreLoad: boolean = false;

  public groupProps: any = {
    size: 100,
    page: 0,
  };

  public userProps: any = {
    size: 100,
    page: 0,
  };

  public referenceProps: any = {
    objectClass: null,
    size: 100,
    page: 0,
  };

  public preloader: boolean = true;

  public created() {
    this.listId = this.$_.get(this.$router.currentRoute, 'params.listId');
    this.dataHeader = [];
    this.getHeadSchema();
  }

  public async getHeadSchema() {
    try {
      const result = await this.$API.object.view.get(this.listId);
      this.name = this.$_.get(result.data.props, 'name');
      this.searchById = this.$_.get(result.data.props, 'searchById');
      this.objectClass = this.$_.get(result.data, 'objectClass');
      this.props.objectClass = this.objectClass;
      this.header = this.$_.get(result.data.props, 'grid');
      this.filters = this.$_.get(result.data.props, 'filter');

      const data = {
        objectClassId: this.objectClass,
        size: 500,
      };
      const results = await this.$API.object.field.list(data);
      this.fields = results.data.content;

      if (!this.$_.isEmpty(this.filters)) {
        const zeroFilters = this.$_.clone(this.filters);
        zeroFilters.forEach((item: any, index: number) => {
          this.fields.forEach((fild: any) => {
            if (item.i.key === 'search') {
              this.$set(this.filters, index, item);
            }
            if (item.i.id === fild.id && item.i.key !== 'search') {
              item.i = fild;
              this.$set(this.filters, index, item);
              if (this.$_.get(this.filters[index].i, 'type') === 'OBJECT') {
                this.$set(this.props.values, item.i.key, []);
              } else {
                this.$set(this.props.values, item.i.key, '');
              }
            }
          });
        });
      }

      const chackAdd = await this.$API.object.rules.execute({
        action: 'ADD',
        objectClass: this.objectClass,
      });
      this.addSucces = this.$_.get(chackAdd, 'data.object', false);

      const gridFilters = this.$Helper.transformToVuetifyGrid(this.filters);
      this.filters = gridFilters;

      let firstFilters = this.$_.get(this.filters, 0, []);
      let secondFilters = this.$_.get(this.filters, 1, []);
      if (!this.$_.isEmpty(firstFilters)) {
        const buff = firstFilters.filter(
          (item: any) => item.i.key !== 'search',
        );
        firstFilters = buff;
      }
      if (!this.$_.isEmpty(secondFilters)) {
        const buff = secondFilters.filter(
          (item: any) => item.i.key !== 'search',
        );
        secondFilters = buff;
      }
      const allFilters = this.$_.concat(firstFilters, secondFilters);

      // Удаление старых полей из фильтров
      this.header.sort((a, b) => {
        if (a.x > b.x) {
          return 1;
        }
        if (a.x < b.x) {
          return -1;
        } else {
          return 0;
        }
      });
      const header: any = [];
      this.header.forEach((item: any) => {
        this.fields.forEach((fild: any) => {
          if (item.i.id === fild.id) {
            item.i = fild;
            header.push(item);
          }
        });
      });
      this.header = header;
      this.curentHeader();
      this.getList();
      this.getObjects(allFilters);
    } catch (e) {}
  }

  public async getObjects(allFilters: any) {
    this.objects = {};
    const objectsQueries: any = [];
    this.$_.forEach(allFilters, (item: any) => {
      const reference: any = this.$_.get(item, 'i.props.object.reference');
      // Классы
      if (reference) {
        objectsQueries.push(
          new Promise((resolve) => {
            const referenceProps: any = this.$_.clone(this.referenceProps);
            referenceProps.objectClass = reference;
            this.$API.object.values.list(referenceProps).then((r: any) => {
              resolve({
                fieldId: this.$_.get(item, 'i.id'),
                data: r.data,
              });
            });
          }),
        );
      }

      // Группы
      if (this.$_.get(item, 'i.props.type') === 'group') {
        objectsQueries.push(
          new Promise((resolve) => {
            this.$API.groups.list(this.groupProps).then((r: any) => {
              resolve({
                fieldId: this.$_.get(item, 'i.id'),
                data: r.data,
              });
            });
          }),
        );
      }

      // Пользователи
      if (this.$_.get(item, 'i.props.type') === 'user') {
        objectsQueries.push(
          new Promise((resolve) => {
            this.$API.users.list(this.userProps).then((r: any) => {
              resolve({
                fieldId: this.$_.get(item, 'i.id'),
                data: r.data,
              });
            });
          }),
        );
      }
    });

    const objectsResult = await Promise.all(objectsQueries);
    this.$_.forEach(objectsResult, (item: any) => {
      if (this.$_.get(item, 'fieldId')) {
        this.objects[this.$_.get(item, 'fieldId')] = {
          data: this.$_.get(item, 'data.content'),
          page: 0,
          last: this.$_.get(item, 'data.last'),
        };
      }
    });
  }

  public async getMoreObjects(
    type: string,
    id: number,
    page: number,
    reference: number = 0,
  ) {
    this.loadingMoreLoad = true;
    const objectsQueries = [];
    // Классы
    if (type === 'select') {
      objectsQueries.push(
        new Promise((resolve) => {
          const referenceProps: any = this.$_.clone(this.referenceProps);
          referenceProps.objectClass = reference;
          referenceProps.page = page + 1;
          this.$API.object.values.list(referenceProps).then((r: any) => {
            resolve({
              fieldId: id,
              data: r.data,
            });
          });
        }),
      );
    }

    // Группы
    if (type === 'group') {
      objectsQueries.push(
        new Promise((resolve) => {
          const groupProps = this.$_.clone(this.groupProps);
          groupProps.page = page + 1;
          this.$API.groups.list(groupProps).then((r: any) => {
            resolve({
              fieldId: id,
              data: r.data,
            });
          });
        }),
      );
    }

    // Пользователи
    if (type === 'user') {
      objectsQueries.push(
        new Promise((resolve) => {
          const userProps = this.$_.clone(this.userProps);
          userProps.page = page + 1;
          this.$API.users.list(userProps).then((r: any) => {
            resolve({
              fieldId: id,
              data: r.data,
            });
          });
        }),
      );
    }
    const objectsResult = await Promise.all(objectsQueries);
    if (this.$_.get(objectsResult, '0.data.content.length') === 0) {
      return;
    } else {
      const fullArr = this.$_.concat(
        this.objects[id].data,
        this.$_.get(objectsResult, '0.data.content'),
      );
      this.$_.forEach(fullArr, (item: any, index: number) => {
        this.$set(this.objects[id].data, index, item);
      });
      this.$set(this.objects[id], 'page', page + 1);
      this.$set(
        this.objects[id],
        'last',
        this.$_.get(objectsResult, '0.data.last'),
      );
      this.$forceUpdate();
    }
    this.loadingMoreLoad = false;
  }

  public openFilters() {
    this.openFilter = !this.openFilter;
  }

  public async onChangedSearch(val: string, key: string) {
    this.props.page = 0;
    if (val === '') {
      this.props.values[key] = val || '';
      this.getList();
    } else {
      if (val.match(/^([0-9]*)$/g) && this.searchById === true) {
        const num = Number(val);
        let status;
        try {
          await this.$API.object.values
            .exists(num)
            .then((response: any) => (status = response.status))
            .catch((error: any) => (status = error.status));
          if (status === 200) {
            const modelId: any = this.objectClass;
            const objectId: any = num;
            this.$router.push({
              name: 'modelCard',
              params: { modelId, objectId },
            });
          } else {
            this.props.values[key] = val || '';
            this.getList();
          }
        } catch (e) {}
      } else {
        this.props.values[key] = val || '';
        this.getList();
      }
    }
  }

  public async getList() {
    this.clearState();
    this.totalElement = 0;
    this.items = [];
    this.infiniteId = +new Date();
  }

  public curentHeader() {
    this.dataHeader = [];
    this.header.forEach((item: any, index: number) => {
      this.dataHeader.push({
        id: index,
        type: item.i.type,
        value: item.i.key,
        text: item.i.name,
        width: `${item.w * 5}%`,
        sortable: false,
      });
    });
    this.dataHeader.unshift({
      id: 0,
      type: 'STRING',
      value: 'id',
      text: '#',
      width: '1%',
      align: 'right',
      sortable: false,
    });
  }

  public goToCardd() {
    const modelId: any = this.objectClass;
    this.$router.push({ name: 'modelCard', params: { modelId } });
  }

  public openCard(item: any) {
    const modelId: any = this.objectClass;
    const objectId: any = item.id;
    this.$router.push({ name: 'modelCard', params: { modelId, objectId } });
  }

  public getFormattedDate(date: string) {
    try {
      return date
        ? this.$Moment(new Date(Number(date) * 1000)).format('DD.MM.YYYY')
        : '';
    } catch (e) {
      return date;
    }
  }

  public async infiniteHandler($state: any) {
    try {
      if (this.objectClass < 1) {
        return false;
      }

      this.preloader = true;

      this.props.id = Number(this.listId);
      const results = await this.$API.object.values.viewList(this.props);

      this.totalElement = this.$_.get(results, 'data.totalElements');
      this.items = this.$_.concat(
        this.items,
        this.$_.get(results, 'data.content', []),
      );

      if (!this.$_.get(results, 'data.last')) {
        this.props.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }

      this.preloader = false;
    } catch (e) {
      $state.complete();

      this.preloader = false;
      this.errorMsg = this.$_.get(e, 'message');
    }
  }

  public dateFormatUpdate(id: any, date: any) {
    try {
      const formatted = date ? this.$Moment(date).format('DD.MM.YYYY') : '';
      this.dateFormatted[id] = formatted;
    } catch (e) {}
  }

  public clearState() {
    this.errorMsg = '';
  }

  public getSelectTextField(element: any, item: any) {
    if (this.$_.get(element, 'type') !== 'OBJECT') {
      return '';
    }

    switch (this.$_.get(element, 'props.type')) {
      case 'user':
        return this.$_.get(item, 'fio');

      case 'group':
        return this.$_.get(item, 'name');

      default:
        return this.$_.get(
          item,
          this.$_.get(element, 'props.object.textField'),
          this.$_.get(item, 'id', ''),
        );
    }
  }

  public getFilterValue(key: string, bol: boolean) {
    if (this.data[key]) {
      this.$set(this.props.values, key, this.data[key]);
    } else {
      if (bol) {
        this.$set(this.props.values, key, this.data[key]);
      } else {
        this.$set(this.props.values, key, []);
      }
    }
    this.getList();
  }

  public checkViewDate(item: any) {
    try {
      if (
        this.$_.isNull(this.$_.get(item, 'dateView')) &&
        this.$_.get(this.$store.getters['user/ITEM'], 'id') !==
          this.$_.get(item, 'user.id')
      ) {
        return {
          class: ['have_change_new'],
          title: 'Новое',
        };
      } else {
        return this.$_.toNumber(item.dateEdit) > this.$_.toNumber(item.dateView)
          ? {
              class: ['have_change_old'],
              title: 'Изменено',
            }
          : null;
      }
    } catch (e) {
      return '';
    }
  }

  @Watch('$route')
  public newRoute() {
    this.listId = this.$_.get(this.$router.currentRoute, 'params.listId');
    this.preloader = true;
    this.items = [];
    this.props.page = 0;
    this.openFilter = false;
    this.clearState();
    this.getHeadSchema();
  }
}
