import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import UploadButton from 'vuetify-upload-button';

@Component({
  name: 'files',
  components: {
    'upload-btn': UploadButton,
    InfiniteLoading,
  },
})
export default class Files extends Vue {
  @Prop({ default: null }) public objectId!: any;

  @Prop({ default: null }) public fileField!: any;

  @Prop({ default: null }) public cardAccess!: any;

  public expandPanel: any = [];

  public canAddFiles: boolean = false;

  public selectedFileFieldId: any = null;

  public fileItems: any = [];

  public fileObjFields: any = {};

  public keyField: string = '';

  public loading: boolean = false;

  public created() {
    this.keyField = this.$_.get(this.fileField, 'key', '');
    this.initFileObject();
    this.getFileItems();
  }

  @Watch('cardAccess')
  public initUpdateObject() {
    this.getFileItems();
  }

  public async initFileObject() {
    try {
      // Проверка прав доступа
      if (this.objectId) {
        this.canAddFiles =
          this.checkExistActions('add', 'fields') &&
          this.checkExistActions('edit', 'fields')
            ? true
            : false;
      } else {
        this.canAddFiles = this.checkExistActions('add', 'fields')
          ? true
          : false;
      }

      const fields = await this.$API.object.field.list({
        objectClassId: this.$_.get(this.fileField, 'props.object.reference'),
        size: 200,
      });
      this.fileObjFields = this.$_.get(fields.data, 'content');
    } catch (e) {}
  }

  public async getFileItems() {
    try {
      if (!this.$_.get(this.fileField, 'value.length')) {
        this.fileItems = [];
        return;
      }

      // Загружаем только новые значения
      const values: any = [];
      const objectClass = this.$_.get(this.fileField, 'props.object.reference');
      this.$_.forEach(this.$_.get(this.fileField, 'value'), (id: any) => {
        if (
          !this.$_.find(
            this.fileItems,
            (file: any) => this.$_.get(file, 'objectId') === id,
          )
        ) {
          values.push(id);
        }
      });
      if (!this.$_.get(values, 'length')) {
        return;
      }

      const payload = {
        objectClass,
        where: {
          operator: 'and',
          matchers: [
            {
              target: 'values.id',
              type: 'in',
              value: values,
            },
          ],
        },
        size: 1000,
        postprocess: true,
      };

      const result = await this.$API.object.values.list(payload);
      // Проверка прав доступа
      const files = this.$_.map(
        this.$_.get(result, 'data.content', []),
        (el: any) => {
          const data: any = this.$_.get(
            el,
            this.$_.get(this.fileField, 'props.object.fileField'),
          );
          const id = this.$_.get(el, 'id');
          data.objectId = id;
          if (this.objectId) {
            data.access = {
              view: this.checkExistActions('view', 'values', id),
              edit: this.checkExistActions('edit', 'values', id),
              delete:
                this.checkExistActions('delete', 'values', id) &&
                this.checkExistActions('edit', 'fields', id),
            };
          } else {
            data.access = {
              view: this.checkExistActions('add', 'fields', id),
              edit: this.checkExistActions('add', 'fields', id),
              delete: this.checkExistActions('add', 'fields', id),
            };
          }
          return data;
        },
      );

      this.fileItems = this.$_.concat(
        this.fileItems,
        this.$_.filter(files, (el: any) => this.$_.get(el, 'access.view')),
      );
    } catch (e) {}
  }

  public checkExistActions(
    action: string = 'add',
    type: string = 'fields',
    id: string = '',
  ) {
    try {
      const data =
        action + '.' + type + '.' + this.$_.get(this.fileField, 'key');

      const fieldValue: any = this.$_.get(this.cardAccess, data);

      if (type === 'fields') {
        return fieldValue;
      }

      return this.$_.find(
        fieldValue,
        (value: any, key: any) => Number(key) === Number(id),
      );
    } catch (e) {}
  }

  public uploadBtnAction(id: any) {
    try {
      const uploadBtn: any = this.$_.get(this.$refs, 'file-' + id);
      this.selectedFileFieldId = id;
      uploadBtn.$el.querySelectorAll('input[type="file"]')[0].click();
    } catch (e) {}
  }

  public async updateAttachmentsHelper(fileList: any) {
    try {
      this.loading = true;
      const values = this.$_.get(fileList, 'length') ? fileList : [fileList];
      const fileField = this.$_.find(
        this.fileObjFields,
        (item: any) =>
          this.$_.get(item, 'key') ===
          this.$_.get(this.fileField, 'props.object.fileField'),
      );
      if (!fileField) {
        return;
      }

      // Загружаем файлы
      const fileQueries: any = [];

      this.$_.forEach(values, (item: any) => {
        const formData = new FormData();
        formData.append('file', item);
        fileQueries.push(this.$API.attachment.add(formData));
      });

      const fileResult = await Promise.all(fileQueries);
      const newFiles = this.$_.map(fileResult, (el: any) =>
        this.$_.get(el, 'data.id'),
      );

      // Создаем объекты файлов
      const fileObjectQueries: any = [];
      this.$_.forEach(newFiles, (fileId: any) => {
        const objectField = this.$_.clone(fileField);
        objectField.value = fileId;

        const payload = {
          objectClass: this.$_.get(this.fileField, 'props.object.reference'),
          values: [objectField],
        };
        fileObjectQueries.push(this.$API.object.values.add(payload));
      });

      const objectFiles = await Promise.all(fileObjectQueries);
      const newFileObjects = this.$_.map(objectFiles, (el: any) =>
        this.$_.get(el, 'data.id'),
      );

      const result = this.$_.concat(
        this.$_.isEmpty(this.$_.get(this.fileField, 'value'))
          ? []
          : this.$_.get(this.fileField, 'value'),
        newFileObjects,
      );

      this.$emit('change-value', result);

      if (this.objectId) {
        this.$emit('get-new-rules', result);
      }

      this.$nextTick(() => {
        this.getFileItems();
        this.expandPanel = [true];
      });
    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  public async deleteItem(item: any) {
    try {
      this.fileField.value = this.$_.remove(
        this.fileField.value,
        (id: any) => this.$_.get(item, 'objectId') !== id,
      );
      this.$emit('change-value', this.fileField.value);

      this.fileItems = this.$_.remove(
        this.fileItems,
        (el: any) =>
          this.$_.get(item, 'objectId') !== this.$_.get(el, 'objectId'),
      );

      // TODO: договориться с бэком по поводу способа удаления объектов без привязки
      // await this.$API.object.values.delete(this.$_.get(item, 'objectId'));
    } catch (e) {}
  }
}
