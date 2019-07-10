import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';

@Component({
  components: { Toolbar },
})
export default class DataModelChange extends Vue {
  public error: string = '';
  public form: any = {};
  public loading: boolean = false;
  public isActivateDialog: boolean = false;

  public created() {
    this.$EventBus.$on('VIEW_MODEL_CHANGE_DIALOG', async (id: any = null) => {
      if (id) {
        const result = await this.$API.object.class.get(id);
        this.form = result.data;
      }

      this.isActivateDialog = true;
    });
  }

  public beforeDestroy() {
    this.$EventBus.$off('VIEW_MODEL_CHANGE_DIALOG');
  }

  public clearState() {
    this.error = '';
    this.form = {};
  }

  public cancelAction() {
    this.clearState();
    this.isActivateDialog = false;
  }

  public async successAction() {
    try {
      this.loading = true;
      this.error = '';

      if (this.$_.get(this.form, 'id')) {
        await this.$API.object.class.edit(this.form);

        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Модель успешно обновлена',
        );

        this.cancelAction();
        this.$EventBus.$emit('UPDATE_DATA_MODEL_LIST');
      } else {
        const result = await this.$API.object.class.add(this.form);
        this.$store.dispatch(
          'state/VIEW_NOTIFICATION',
          'Модель успешно создана',
        );
        this.$router.push({
          name: 'dataModelForm',
          params: {
            id: this.$_.get(result.data, 'id'),
          },
        });
      }
    } catch (e) {
      this.error = this.$_.get(e, 'message');
    } finally {
      this.loading = false;
    }
  }
}
