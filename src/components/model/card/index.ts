import { Component, Vue } from 'vue-property-decorator';
import HistoryDialog from './historyDialog/Dialog.vue';
import Comments from './comments/Comments.vue';
import Chats from './chats/Chats.vue';
import Files from './files/Files.vue';
import UserActions from './userActions/UserActions.vue';
import FieldView from './fieldView/FieldView.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';
import { ContentLoader } from 'vue-content-loader';

@Component({
  components: {
    HistoryDialog,
    Comments,
    Chats,
    Files,
    UserActions,
    FieldView,
    ConfirmDialog,
    ContentLoader,
  },
})
export default class ModelCard extends Vue {
  public title: string = '';
  public error: string = '';
  public grid: any = [];

  public historyDialog: boolean = false;
  public objectClassId: number = 0;
  public objectClassCommentField: any = null;

  public objects: any = {};
  public objectAuthor: any = {};
  public objectDateCreate: any = '';
  public objectDateEdit: any = '';

  public datePickers: any = {};
  public dateFormatted: any = {};
  public dateForDatepicket: any = [];

  public canDeleteObject: boolean = false;
  public canSaveObject: boolean = false;
  public showDeleteDialog: boolean = false;

  public preloader: boolean = true;
  public loading: boolean = false;
  public isFormValid: boolean = true;
  public $refs!: {
    form: HTMLFormElement;
  };
  public rules: any = {
    required: (value: boolean) => !!value || 'Обязательное поле',
  };

  public loadingMoreLoad: boolean = false;

  public objectAction: string = '';

  public selectDefaultKey: any = {};

  public groupProps: any = {
    size: 1000,
    page: 0,
  };

  public userProps: any = {
    size: 1000,
    page: 0,
  };

  public referenceProps: any = {
    objectClass: null,
    size: 1000,
    page: 0,
  };

  public objectId: any = null;

  public cardAccess: any = {};

  public hasAddAction: boolean = false;

  public dateFormatUpdate(id: any, date: any) {
    try {
      if (/^([0-9]*)$/g.test(date)) {
        const formatDate = date
          ? this.$Moment(new Date(Number(date) * 1000)).format('DD.MM.YYYY')
          : '';
        this.dateFormatted[id] = formatDate;
        this.dateForDatepicket[id] = date
          ? this.$Moment(new Date(Number(date) * 1000)).format('YYYY-MM-DD')
          : '';
      } else {
        const formatDate = date ? this.$Moment(date).format('DD.MM.YYYY') : '';
        this.dateFormatted[id] = formatDate;
        this.dateForDatepicket[id] = date
          ? this.$Moment(date).format('YYYY-MM-DD')
          : '';
      }
    } catch (e) {}
  }

  public created() {
    this.updateCard();
  }

  public async getRulesForFiles(field: any) {
    try {
      const modelId = this.$_.get(this.$router.currentRoute.params, 'modelId');
      const objectId = this.$_.get(
        this.$router.currentRoute.params,
        'objectId',
      );

      // Сохраняем объект
      const payload: any = {
        id: objectId,
        objectClass: modelId,
        values: [field],
      };

      await this.$API.object.values.edit(payload);

      this.updateRulesCard();
    } catch (e) {}
  }

  public async updateRulesCard() {
    const routeParams = this.$router.currentRoute.params;

    const modelId = this.$_.get(routeParams, 'modelId');
    this.objectClassId = Number(modelId);

    const objectId = this.$_.get(routeParams, 'objectId');
    this.objectId = Number(objectId);
    const queries: any = [];
    if (objectId) {
      queries.push(
        this.$API.object.rules.execute({
          action: 'ADD',
          objectClass: modelId,
          objectCard: objectId,
        }),
      );
      queries.push(
        this.$API.object.rules.execute({
          action: 'VIEW',
          objectClass: modelId,
          objectCard: objectId,
        }),
      );

      queries.push(
        this.$API.object.rules.execute({
          action: 'EDIT',
          objectClass: modelId,
          objectCard: objectId,
        }),
      );

      queries.push(
        this.$API.object.rules.execute({
          action: 'DELETE',
          objectClass: modelId,
          objectCard: objectId,
        }),
      );

      this.objectAction = 'EDIT_LIST';
    } else {
      queries.push(
        this.$API.object.rules.execute({
          action: 'ADD',
          objectClass: modelId,
        }),
      );
      this.objectAction = 'ADD_LIST';
    }

    const result = await Promise.all(queries);

    const resultRulesAdd = this.$_.get(result, '0.data', {});
    const resultRulesView = this.$_.get(result, '1.data', {});
    const resultRulesEdit = this.$_.get(result, '2.data', {});
    const resultRulesDelete = this.$_.get(result, '3.data', {});

    // Формируем объект правил
    this.cardAccess = {
      add: resultRulesAdd,
      view: resultRulesView,
      edit: resultRulesEdit,
      delete: resultRulesDelete,
    };
  }

  public async updateCard() {
    try {
      this.error = '';
      this.preloader = true;

      const routeParams = this.$router.currentRoute.params;

      const modelId = this.$_.get(routeParams, 'modelId');
      this.objectClassId = Number(modelId);

      const objectId = this.$_.get(routeParams, 'objectId');
      this.objectId = Number(objectId);

      const queries: any = [
        this.$API.object.view.list({
          objectClassId: modelId,
          size: 1,
          type: 'CARD',
        }),

        this.$API.object.field.list({
          objectClassId: modelId,
          size: 1000,
        }),
      ];

      if (objectId) {
        queries.push(
          this.$API.object.rules.execute({
            action: 'ADD',
            objectClass: modelId,
            objectCard: objectId,
          }),
        );
        queries.push(
          this.$API.object.rules.execute({
            action: 'VIEW',
            objectClass: modelId,
            objectCard: objectId,
          }),
        );

        queries.push(
          this.$API.object.rules.execute({
            action: 'EDIT',
            objectClass: modelId,
            objectCard: objectId,
          }),
        );

        queries.push(
          this.$API.object.rules.execute({
            action: 'DELETE',
            objectClass: modelId,
            objectCard: objectId,
          }),
        );

        queries.push(this.$API.object.values.get(objectId));

        this.objectAction = 'EDIT_LIST';
      } else {
        queries.push(
          this.$API.object.rules.execute({
            action: 'ADD',
            objectClass: modelId,
          }),
        );
        this.objectAction = 'ADD_LIST';
      }

      const result = await Promise.all(queries);

      // ADD object
      const grid = this.$_.get(result, '0.data.content.0.props.grid', []);
      this.title = this.$_.get(result, '0.data.content.0.props.name');

      const fieldSchema = this.$_.get(result, '1.data.content', []);
      const resultRulesAdd = this.$_.get(result, '2.data', {});

      // EDIT object
      const resultRulesView = this.$_.get(result, '3.data', {});
      const resultRulesEdit = this.$_.get(result, '4.data', {});
      const resultRulesDelete = this.$_.get(result, '5.data', {});
      const resultValues = this.$_.get(result, '6.data', {});
      this.$_.forEach(resultValues.values, (item: any) => {
        if (
          item.type === 'OBJECT' &&
          (item.props.type === 'select' || item.props.type === 'user')
        ) {
          this.$set(this.selectDefaultKey, item.id, item.value);
        }
      });

      // Формируем объект правил
      this.cardAccess = {
        add: resultRulesAdd,
        view: resultRulesView,
        edit: resultRulesEdit,
        delete: resultRulesDelete,
      };

      const objectsQueries: any = [];
      this.$_.forEach(fieldSchema, (item: any) => {
        if (this.$_.get(item, 'props.type') === 'file' || this.$_.get(item, 'props.type') === 'chat') {
          return;
        }

        const objectClass: any = this.$_.get(item, 'props.object.reference');
        const objectField: any = this.$_.get(item, 'id');

        // Классы
        if (objectClass) {
          objectsQueries.push(
            new Promise((resolve) => {
              const referenceProps: any = this.$_.clone(this.referenceProps);
              referenceProps.objectClass = objectClass;
              referenceProps.objectCard = this.objectId;
              referenceProps.objectField = objectField;
              referenceProps.objectAction = this.objectAction;

              this.$API.object.values.list(referenceProps).then((r: any) => {
                resolve({
                  fieldId: this.$_.get(item, 'id'),
                  data: r.data,
                });
              });
            }),
          );
        }

        // Группы
        if (this.$_.get(item, 'props.type') === 'group') {
          objectsQueries.push(
            new Promise((resolve) => {
              const groupProps = this.$_.clone(this.groupProps);

              this.$API.groups.list(groupProps).then((r: any) => {
                resolve({
                  fieldId: this.$_.get(item, 'id'),
                  data: r.data,
                });
              });
            }),
          );
        }

        // Пользователи
        if (this.$_.get(item, 'props.type') === 'user') {
          objectsQueries.push(
            new Promise((resolve) => {
              const userProps = this.$_.clone(this.userProps);
              this.$API.users.list(userProps).then((r: any) => {
                resolve({
                  fieldId: this.$_.get(item, 'id'),
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

      // Автор
      const findAuthor: any = this.$_.find(
        this.$_.get(resultValues, 'values'),
        (el: any) =>
          this.$_.get(el, 'type') === 'OBJECT' &&
          this.$_.get(el, 'key') === 'user',
      );
      this.objectAuthor = this.$_.get(findAuthor, 'value', {});

      // Дата создания
      const findDateCreate: any = this.$_.find(
        this.$_.get(resultValues, 'values'),
        (el: any) =>
          this.$_.get(el, 'type') === 'DATE' &&
          this.$_.get(el, 'key') === 'dateOpen',
      );
      this.objectDateCreate = this.$Helper.formatDate(
        this.$_.get(findDateCreate, 'value', ''),
        'DD.MM.YYYY HH:mm',
      );

      // Дата изменения
      const findDateEdit: any = this.$_.find(
        this.$_.get(resultValues, 'values'),
        (el: any) =>
          this.$_.get(el, 'type') === 'DATE' &&
          this.$_.get(el, 'key') === 'dateEdit',
      );
      if (
        this.$_.get(findDateCreate, 'value') !==
        this.$_.get(findDateEdit, 'value')
      ) {
        this.objectDateEdit = this.$Helper.formatDate(
          this.$_.get(findDateEdit, 'value', ''),
          'DD.MM.YYYY HH:mm',
        );
      }

      // Обновляем сетку
      if (grid) {
        this.$_.forEach(grid, (val: any, index: any) => {
          const item = this.$_.find(
            this.$_.get(resultValues, 'values.length')
              ? this.$_.get(resultValues, 'values')
              : fieldSchema,
            {
              id: this.$_.get(val, 'i.id'),
            },
          );

          if (item) {
            grid[index].i = item;

            // Инициализируем преобразование для даты
            if (this.$_.get(item, 'type') === 'DATE') {
              this.dateFormatUpdate(
                this.$_.get(item, 'id'),
                this.$_.get(item, 'value'),
              );
            }
          }

          // Параметры по умолчанию
          if (!this.$_.has(grid[index], 'i.value')) {
            grid[index].i.value = null;
          }

          // Права доступа
          if (objectId) {
            grid[index].i.view = this.$_.get(
              resultRulesView,
              'fields.' + this.$_.get(grid[index].i, 'key'),
              true,
            );
            grid[index].i.readonly = !this.$_.get(
              resultRulesEdit,
              'fields.' + this.$_.get(grid[index].i, 'key'),
              true,
            );
          } else {
            grid[index].i.view = this.$_.get(
              resultRulesAdd,
              'fields.' + this.$_.get(grid[index].i, 'key'),
              true,
            );
          }
        });
        this.grid = this.$Helper.transformToVuetifyGrid(grid);
      }

      // Права доступа
      this.canDeleteObject = this.$_.get(resultRulesDelete, 'object', true);
      this.canSaveObject = this.$_.get(resultRulesEdit, 'save', true);
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    } finally {
      this.preloader = false;
    }
  }

  public deleteObject() {
    this.changeDeleteDialog(true);
  }

  public async deleteCallback() {
    try {
      this.error = '';
      await this.$API.object.values.delete(this.objectId);
      this.changeDeleteDialog(false);
      this.$router.go(-1);
    } catch (e) {
      this.changeDeleteDialog(false);
      this.error = this.$_.get(e, 'message');
    }
  }

  public changeDeleteDialog(state: boolean) {
    this.showDeleteDialog = state;
  }

  public getFormFieldRules(props: any) {
    try {
      const result: any = [];

      if (this.$_.get(props, 'required')) {
        result.push(this.rules.required);
      }

      return result;
    } catch (e) {
      return [];
    }
  }

  public openView() {
    this.$router.go(this.hasAddAction ? -2 : -1);
  }

  public async successAction() {
    try {
      if (!this.$refs.form.validate()) {
        return false;
      }

      this.loading = true;
      this.error = '';
      const modelId = this.$_.get(this.$router.currentRoute.params, 'modelId');
      const objectId = this.$_.get(
        this.$router.currentRoute.params,
        'objectId',
      );

      let values: any = [];
      this.$_.forEach(this.grid, (row: any) => {
        values = this.$_.concat(values, this.$_.map(row, (el: any) => el.i));
      });

      // Удаляем комментарии из полей, чтобы исключить перезапись значений.
      // Очищаем объект от кастомных элементов фронта.
      values = this.$_.filter(
        values,
        (item: any) =>
          this.$_.get(item, 'props.type') !== 'comments' &&
          this.$_.get(item, 'type') !== 'CUSTOM_FIELD',
      );

      // Исправляем структуру значений
      this.$_.forEach(values, (item: any, index: any) => {
        if (
          this.$_.get(item, 'type') === 'OBJECT' &&
          this.$_.isEmpty(this.$_.get(item, 'value')) &&
          !this.$_.get(item, 'value')
        ) {
          if (this.$_.get(item, 'props.object.multiple')) {
            values[index].value = [];
          } else {
            values[index].value = null;
          }
        }

        if (this.$_.get(item, 'type') === 'DATE') {
          let unix: any;
          if (this.dateForDatepicket[item.id]) {
            unix = this.$Moment(this.dateForDatepicket[item.id]).unix();
          } else {
            unix = '';
          }
          item.value = Number(unix);
        }
      });

      // Сохраняем объект
      const payload: any = {
        id: objectId,
        objectClass: modelId,
        values,
      };

      if (objectId) {
        await this.$API.object.values.edit(payload);
        this.$store.dispatch('state/VIEW_NOTIFICATION', 'Успешно сохранено');
      } else {
        this.hasAddAction = true;

        const card = await this.$API.object.values.add(payload);
        this.$router.push({
          name: 'modelCard',
          params: {
            modelId: String(this.objectClassId),
            objectId: this.$_.get(card.data, 'id'),
          },
        });

        this.$store.dispatch('state/VIEW_NOTIFICATION', 'Успешно создано');
      }

      this.updateCard();
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    } finally {
      this.loading = false;
    }
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

  public closeHistory() {
    this.historyDialog = false;
  }

  public openHistory() {
    this.historyDialog = true;
  }
}
