import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';
import ChangeDialog from '@/views/admin/dataModel/change/Dialog.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';

@Component({
  name: 'menuRules',
  components: { Toolbar, ChangeDialog, ConfirmDialog },
})
export default class MenuRules extends Vue {
  public objectItems: any[] = [];

  public objectRoles: object[] = [];

  public cons: boolean = false;

  public radioButton: number = 1;

  public primaryRadio: number = 2;

  public roleId: number = 0;

  public mainId: number = 0;

  public created() {
    this.initRolesData();
  }

  public async initObjectData(id: number) {
    const result = await this.$API.object.menu.get(id);
    this.objectItems = result.data.models;
    this.cons = result.data.configuration;
    for (const item of this.objectItems) {
      if (item.primary === true) {
        this.mainId = item.id;
      }
    }
  }

  public async initRolesData() {
    const payload = {};
    const result = await this.$API.roles.list(payload);
    this.objectRoles = result.data;
  }

  public disableOther(id: number) {
    for (let i = 0; i < this.objectItems.length; i += 1) {
      this.objectItems[i].primary = false;
    }
    this.objectItems[id].primary = true;
  }

  public async openRole(item: any) {
    this.roleId = item.id;
    this.mainId = -1;
    this.initObjectData(item.id);
  }

  public async saveMenuRule() {
    try {
      const id = this.roleId;
      const index = this.$_.findIndex(this.objectItems, { id: this.mainId });
      for (const item of this.objectItems) {
        item.primary = false;
      }
      this.objectItems[index].primary = true;
      const payload = {
        configuration: this.cons,
        models: this.objectItems,
      };
      await this.$API.object.menu.edit(id, payload);

      this.$store.dispatch('state/VIEW_NOTIFICATION', `Сохранено`);
      this.$store.dispatch('state/SET_DEFAULT_STATE');

      this.$EventBus.$emit('UPDATE_VIEW');
    } catch (e) {
      this.$store.dispatch('state/VIEW_NOTIFICATION', `${e.message}`);
    }
  }

  public cancelBtn() {
    this.$router.go(-1);
  }
}
