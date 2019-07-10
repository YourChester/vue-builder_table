import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';

@Component({
  components: {
    Toolbar,
    editor: require('vue2-ace-editor'),
  },
})
export default class DataEventsDialog extends Vue {
  public error: string = '';
  public form: any = {
    objectClass: '',
    properties: {
      notification: {
        usersField: '',
        text: '',
      },
    },
    event: '',
    objectField: '',
    type: '',
    rules: [
      {
        name: '',
        json: '',
        roles: [],
      },
    ],
  };
  public list: any = {
    fields: [],
    events: [],
    types: [],
    roles: [],
  };

  public userFields: any = [];
  public isActiveDialog: boolean = false;
  public isFormValid: boolean = false;
  public loading: boolean = false;

  public created() {
    this.$EventBus.$on(
      'VIEW_TRIGGER_CHANGE_DIALOG',
      (objectClass: any, id: any) => {
        this.initData(objectClass, id);
        this.changeDialogState(true);
      },
    );
  }

  public beforeDestroy() {
    this.$EventBus.$off('VIEW_TRIGGER_CHANGE_DIALOG');
  }

  public async initData(objectClass: any = '', id: any = '') {
    try {
      this.form.objectClass = objectClass;

      const queries = [
        this.$API.object.field.list({
          size: 1000,
          objectClassId: this.form.objectClass,
        }),
        this.$API.object.trigger.events(),
        this.$API.object.trigger.types(),
        this.$API.roles.list(),
      ];

      if (id) {
        queries.push(this.$API.object.trigger.get(id));
      }

      const result = await Promise.all(queries);

      this.list.fields = this.$_.get(result, '0.data.content', []);
      this.list.events = this.$_.get(result, '1.data', []);
      this.list.types = this.$_.get(result, '2.data', []);
      this.list.roles = this.$_.get(result, '3.data', []);
      this.form = this.$_.get(result, '4.data')
        ? this.$_.get(result, '4.data')
        : this.form;

      // Преобразования полей
      this.userFields = this.$_.filter(
        this.list.fields,
        (el: any) => this.$_.get(el, 'props.type') === 'user',
      );
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    }
  }

  public changeDialogState(state: boolean) {
    if (!state) {
      this.resetForm();
    }

    this.isActiveDialog = state;
  }

  public resetForm() {
    this.form = {
      objectClass: '',
      properties: {
        notification: {
          usersField: '',
          text: '',
        },
      },
      rules: [
        {
          name: '',
          json: '',
          roles: [],
        },
      ],
    };
  }

  public addRule() {
    this.form.rules.push({
      name: '',
      json: '',
      roles: [],
    });
  }

  public cancelAction() {
    this.changeDialogState(false);
  }

  public setItemName() {
    try {
      if (this.$_.get(this.form, 'name')) {
        return;
      }

      const result = [];

      if (this.$_.get(this.form, 'event')) {
        const item = this.$_.find(
          this.list.events,
          (el: any) => this.$_.get(el, 'value') === this.form.event,
        );

        if (this.$_.get(item, 'text')) {
          result.push(this.$_.get(item, 'text'));
        }
      }

      if (this.$_.get(this.form, 'objectField')) {
        const item = this.$_.find(
          this.list.fields,
          (el: any) => this.$_.get(el, 'id') === this.form.objectField,
        );

        if (this.$_.get(item, 'name')) {
          result.push(this.$_.get(item, 'name'));
        }
      }

      if (this.$_.get(this.form, 'type')) {
        const item = this.$_.find(
          this.list.types,
          (el: any) => this.$_.get(el, 'value') === this.form.type,
        );

        if (this.$_.get(item, 'text')) {
          result.push(this.$_.get(item, 'text'));
        }
      }

      this.form.name = result.join(' - ');
    } catch (e) {
      this.form.name = '';
    }
  }

  public async successAction() {
    try {
      this.loading = true;
      this.error = '';

      this.setItemName();
      await this.$API.object.trigger.update(this.form);

      if (this.$_.get(this.form, 'id')) {
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Триггер успешно обновлен',
        );
      } else {
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Триггер успешно создан',
        );
      }

      this.$EventBus.$emit('UPDATE_TRIGGERS_VIEW');
      this.cancelAction();
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    } finally {
      this.loading = false;
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
