import { Component, Vue, Prop } from 'vue-property-decorator';
import UploadButton from 'vuetify-upload-button';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';
import InfiniteLoading from 'vue-infinite-loading';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
// @ts-ignore
import { quillEditor } from 'vue-quill-editor';
import { emit } from 'cluster';

@Component({
  name: 'comments',
  components: {
    'upload-btn': UploadButton,
    quillEditor,
    ConfirmDialog,
    InfiniteLoading,
  },
})
export default class Comments extends Vue {
  @Prop({ default: null }) public objectId!: any;
  @Prop({ default: null }) public commentField!: any;
  @Prop({ default: null }) public cardAccess!: any;

  public fieldKeys: any = {
    text: '',
  };

  public comment: any = {
    id: null,
    text: '',
    attachments: [],
  };
  public commentObjFields: any = {};

  public loading: boolean = false;
  public removeDialogActive: boolean = false;

  public items: any = [];

  public config = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    },
    placeholder: 'Введите текст комментария',
  };

  public currentComment: any = null;

  public canAddComment: boolean = false;

  public infiniteId: number = +new Date();

  public error: string = '';

  public offset: number = 0;
  public size: number = 5;

  public created() {
    this.initCommentObject();
  }

  public async initCommentObject() {
    try {
      // Права на добавление
      this.canAddComment =
        this.checkExistActions('add', 'fields') &&
        this.checkExistActions('edit', 'fields')
          ? true
          : false;

      // Права на просмотр
      const valuesForView = this.$_.get(
        this.cardAccess,
        'view.values.' + this.$_.get(this.commentField, 'key'),
      );

      const viewOnly: any = [];
      this.$_.forEach(valuesForView, (value: any, key: any) => {
        if (value) {
          viewOnly.push(this.$_.toNumber(key));
        }
      });
      this.commentField.value = viewOnly;

      // Параметр по умолчанию
      this.fieldKeys.text = this.$_.get(
        this.commentField,
        'props.object.textField',
      );

      // Схема для комментария
      const fields = await this.$API.object.field.list({
        objectClassId: this.$_.get(this.commentField, 'props.object.reference'),
        size: 200,
      });
      this.commentObjFields = this.$_.get(fields.data, 'content');
    } catch (e) {}
  }

  public async infiniteHandler($state: any) {
    try {
      this.error = '';

      if (!this.$_.get(this.commentField, 'value.length')) {
        $state.complete();
        return;
      }

      const payload = {
        objectClass: this.$_.get(this.commentField, 'props.object.reference'),
        sort: [
          {
            direction: 'DESC',
            field: 'id',
          },
        ],
        where: {
          operator: 'and',
          matchers: [
            {
              target: 'values.id',
              type: 'in',
              value: this.$_.get(this.commentField, 'value'),
            },
          ],
        },
        size: this.size,
        offset: this.offset,
        postprocess: true,
      };
      const result = await this.$API.object.values.list(payload);

      // Проверка прав доступа
      const resultData = this.$_.map(
        this.$_.get(result, 'data.content'),
        (el: any) => {
          const id = this.$_.get(el, 'id');

          el.access = {
            view: this.checkExistActions('view', 'values', id),
            edit: this.checkExistActions('edit', 'values', id),
            delete:
              this.checkExistActions('delete', 'values', id) &&
              this.checkExistActions('edit', 'fields')
                ? true
                : false,
          };

          return el;
        },
      );
      this.items = this.$_.concat(this.items, resultData);

      if (!this.$_.get(result, 'data.last')) {
        this.offset += this.size;
        $state.loaded();
      } else {
        $state.complete();
      }
    } catch (e) {
      $state.complete();
      this.error = this.$_.get(e, 'message');
    }
  }

  public async getComments() {
    this.offset = 0;
    this.items = [];
    this.infiniteId = +new Date();
  }

  public getShortName(name: string) {
    try {
      if (!name) {
        return '';
      }

      const nameArr = name.toUpperCase().split(' ');
      let result = nameArr[0].charAt(0);

      if (nameArr[1]) {
        result += nameArr[1].charAt(0);
      }

      return result;
    } catch (e) {
      return '';
    }
  }

  public async saveComment(e: any) {
    try {
      e.preventDefault();
      e.stopPropagation();
      this.loading = true;

      // Создаем комментрий
      const values: any = [];
      const textFieldKey = this.$_.get(
        this.commentField,
        'props.object.textField',
      );

      this.$_.forEach(this.commentObjFields, (item: any) => {
        if (this.$_.get(item, 'key') === textFieldKey) {
          item.value = this.comment.text;
          values.push(item);
        }
      });

      const payload = {
        id: this.comment.id,
        objectClass: this.$_.get(this.commentField, 'props.object.reference'),
        values,
      };

      if (this.comment.id) {
        const result = await this.$API.object.values.edit(payload);
        this.updateComments(result.data);
        this.$store.dispatch('state/VIEW_NOTIFICATION', 'Комментарий обновлен');
      } else {
        const commentResult = await this.$API.object.values.add(payload);

        // Добавляем id комментария к родительскому объекту
        if (!this.$_.get(this.commentField, 'value')) {
          this.commentField.value = [commentResult.data.id];
        } else {
          this.commentField.value.push(commentResult.data.id);
        }

        const payloadObj = {
          id: this.objectId,
          objectClass: this.$_.get(this.commentField, 'objectClass'),
          values: [this.commentField],
        };
        await this.$API.object.values.edit(payloadObj);

        this.updateComments(commentResult.data);
        this.$store.dispatch('state/VIEW_NOTIFICATION', 'Комментарий добавлен');
      }

      this.resetCommentForm();
    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  public async updateComments(item: any) {
    try {
      // Получаем обновленный элемент
      const id = this.$_.get(item, 'id');
      const payload = {
        objectClass: this.$_.get(this.commentField, 'props.object.reference'),
        where: {
          operator: 'and',
          matchers: [
            {
              target: 'id',
              type: 'in',
              value: [id],
            },
          ],
        },
        size: 1,
        postprocess: true,
      };
      const result = await this.$API.object.values.list(payload);
      const updatedItem = this.$_.get(result, 'data.content.0', null);
      if (!updatedItem) {
        return;
      }

      // Обновляем элемент
      const findIndex = this.$_.findIndex(
        this.items,
        (el: any) => this.$_.get(el, 'id') === id,
      );

      // Проверка прав доступа
      const queries: any = [];
      const objectClassParent = this.$_.get(this.commentField, 'objectClass');
      queries.push(
        await this.$API.object.rules.execute({
          action: 'EDIT',
          objectClass: objectClassParent,
          objectCard: this.objectId,
        }),
      );
      queries.push(
        await this.$API.object.rules.execute({
          action: 'DELETE',
          objectClass: objectClassParent,
          objectCard: this.objectId,
        }),
      );

      const rules: any = await Promise.all(queries);
      this.cardAccess.edit =
        this.$_.get(rules, '0.data') || this.cardAccess.edit;

      this.cardAccess.delete =
        this.$_.get(rules, '1.data') || this.cardAccess.delete;

      updatedItem.access = {
        view: true,
        edit: this.checkExistActions('edit', 'values', id),
        delete:
          this.checkExistActions('delete', 'values', id) &&
          this.checkExistActions('edit', 'fields')
            ? true
            : false,
      };

      if (findIndex !== -1) {
        this.$set(this.items, findIndex, updatedItem);
      } else {
        this.items.unshift(updatedItem);
        this.offset += 1;
      }
    } catch (e) {}
  }

  public editComment(item: any) {
    this.comment.id = this.$_.get(item, 'id');
    this.comment.text = this.$_.get(
      item,
      this.$_.get(this.commentField, 'props.object.textField'),
      '',
    );

    this.scrollToElement('add-comment-form');
  }

  public resetCommentForm() {
    this.comment.id = null;
    this.comment.text = '<p></p>';
    this.comment.attachments = [];
  }

  public scrollToElement(id: string) {
    try {
      const element: any = document.getElementById(id);
      element.scrollTop = element.scrollHeight - element.clientHeight;
    } catch (e) {}
  }

  public deleteComment(item: any) {
    this.currentComment = item;
    this.changeDeleteDialogState(true);
  }

  public changeDeleteDialogState(state: any) {
    this.removeDialogActive = state;
  }

  public async deleteCallback() {
    try {
      /*
      await this.$API.object.values.delete(
        this.$_.get(this.currentComment, 'id'),
      );
      */

      // Удаляем id комментария из родительского объекта
      this.commentField.value = this.$_.remove(
        this.commentField.value,
        (id: number) => id !== this.$_.get(this.currentComment, 'id'),
      );

      const payloadObj = {
        id: this.objectId,
        objectClass: this.$_.get(this.commentField, 'objectClass'),
        values: [this.commentField],
      };
      await this.$API.object.values.edit(payloadObj);

      // Удаляем комментарий в UI
      this.offset -= 1;
      this.items = this.$_.remove(
        this.items,
        (item: any) =>
          this.$_.get(item, 'id') !== this.$_.get(this.currentComment, 'id'),
      );

      this.$store.dispatch('state/VIEW_NOTIFICATION', 'Комментарий удален');
      this.changeDeleteDialogState(false);
    } catch (e) {
    } finally {
      this.currentComment = null;
    }
  }

  public updateCommentAttachment(files: any) {
    try {
      const fileList = this.$_.get(files, 'length')
        ? this.$_.map(files, (el: any) => el)
        : [files];

      this.comment.attachments = this.$_.concat(
        this.comment.attachments,
        fileList,
      );
    } catch (e) {}
  }

  public removeCommentAttachment() {}

  public checkExistActions(
    action: string = 'add',
    type: string = 'fields',
    id: string = '',
  ) {
    try {
      const fieldValue: any = this.$_.get(
        this.cardAccess,
        action + '.' + type + '.' + this.$_.get(this.commentField, 'key'),
      );

      if (type === 'fields') {
        return fieldValue;
      }

      return this.$_.find(
        fieldValue,
        (value: any, key: any) => Number(key) === Number(id),
      );
    } catch (e) {}
  }
}
