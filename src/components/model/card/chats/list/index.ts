import { Component, Vue, Prop } from 'vue-property-decorator';
import CommonUsers from '@/components/common/user/User.vue';
import ConfirmDialog from '@/components/common/dialogs/ConfirmDialog.vue';

@Component({
  name: 'chat-list',
  components: {
    CommonUsers,
    ConfirmDialog,
  },
})
export default class ChatList extends Vue {
  @Prop({ default: null }) public objectId!: any;

  @Prop({ default: null }) public cardAccess!: any;

  @Prop({ default: null }) public objectCardId!: any;

  @Prop({ default: null }) public idChats!: any;

  @Prop({ default: null }) public commentField!: any;

  public active: number = 0;
  public cloneChatsId: any = [];
  public removeDialogActive: boolean = false;
  public selectedChatToDelete: number = 0;
  public selectedIndexChatToDelete: number = 0;

  public errorMsg: string = '';
  public openDialog: boolean = false;
  public loading: boolean = false;
  public editChatId: any = null;

  public chatList: any = [];
  public shemaChat: any = [];

  public form: any = {};
  public selectedForUsers: any = [];
  public creatorForUsers: any = null;
  public userKey: string = '';
  public nameKey: string = '';
  public accessKey: string = '';

  public $refs!: {
    form: HTMLFormElement;
  };

  public rules: any = {
    required: (v: any) => !!v || 'Обязательно для заполнения',
  };

  public created() {
    this.cloneChatsId = this.$_.clone(this.idChats);
    this.accessKey = this.commentField.key;
    this.getChatList();
    this.getSchema();
  }

  public async getSchema() {
    const payload = {
      objectClassId: this.objectId,
      size: 100,
    };
    const result = await this.$API.object.field.list(payload);
    this.shemaChat = this.$_.get(result, 'data.content');
    this.$_.forEach(this.shemaChat, (item: any) => {
      if (item.type === 'OBJECT' && item.props.type === 'user') {
        this.userKey = this.$_.get(item, 'key');
      }
      if (item.type === 'STRING') {
        this.nameKey = this.$_.get(item, 'key');
      }
    });
    this.$set(this.form, this.nameKey, null);
    this.$set(this.form, this.userKey, []);
  }

  public async getChatList() {
    if (!this.$_.isEmpty(this.cloneChatsId)) {
      const payload = {
        objectClass: this.objectId,
        offset: 0,
        size: 100,
        where: {},
      };
      payload.where = {
        operator: 'and',
        matchers: [
          {
            target: 'values.id',
            type: 'in',
            value: this.cloneChatsId ? this.cloneChatsId : [],
          },
        ],
      };
      const result = await this.$API.object.values.list(payload);
      this.chatList = this.$_.get(result, 'data.content');
    } else {
      this.chatList = [];
    }
  }

  public curentChat(id: number) {
    return this.active === id;
  }

  public openChat(id: number, event: any = null) {
    if (!this.$_.isEmpty(event)) {
      if (event.target.innerHTML !== 'more_vert') {
        this.$emit('open-chat', id);
        this.active = id;
      }
    } else {
      this.$emit('open-chat', id);
      this.active = id;
    }
  }

  public async openChengeDialog(type: string, id: number = 0) {
    this.$EventBus.$emit('COMMON_LIST_LOAD_DATA');
    this.$refs.form.resetValidation();

    if (id !== 0) {
      const item = this.$_.find(this.chatList, { id });
      this.form[this.nameKey] = item[this.nameKey];
      this.form.creator = this.$_.get(item, 'user');
      this.form[this.userKey] = item[this.userKey];
      this.form[this.userKey].push(this.form.creator);
      this.creatorForUsers = {
        id: this.form.creator,
      };
      this.editChatId = id;
    } else {
      this.form.creator = await this.$store.getters['user/ITEM'].id;
      this.form[this.nameKey] = null;
      this.form[this.userKey] = [];
      this.form[this.userKey].push(this.form.creator);
      this.loadUsers(this.form[this.userKey]);
      this.creatorForUsers = {
        id: this.form.creator,
      };
    }
    this.openDialog = true;
  }

  public async loadUsers(userIdList: any) {
    try {
      if (!this.$_.get(userIdList, 'length')) {
        return;
      }

      const payload = {
        include: userIdList,
        size: 100,
        postprocess: true,
      };
      const result = await this.$API.users.list(payload);
      this.selectedForUsers = this.$_.get(result, 'data.content', []);
    } catch (e) {}
  }

  public closeDialog() {
    this.openDialog = false;
    this.form[this.nameKey] = null;
    this.form[this.userKey] = [];
    this.selectedForUsers = [];
  }

  public async saveData() {
    try {
      if (this.$refs.form.validate()) {
        this.loading = true;
        const values: any = [];
        const user: any = [];
        this.$_.forEach(this.form[this.userKey], (item: any) => {
          if (item !== this.form.creator) {
            user.push(item);
          }
        });
        this.$_.forEach(this.shemaChat, (item: any) => {
          if (item.key === this.userKey) {
            item.value = user;
            values.push(item);
          } else if (item.key === this.nameKey) {
            item.value = this.form[this.nameKey];
            values.push(item);
          } else {
            item.value = this.$_.get(this.form, item.key, []);
            values.push(item);
          }
        });

        if (this.editChatId) {
          const payload: any = {
            id: this.editChatId,
            objectClass: this.objectId,
            values,
          };
          await this.$API.object.values.edit(payload);
          this.getChatList();
          this.$store.dispatch('state/VIEW_NOTIFICATION', 'Чат сохранен');
        } else {
          const payload: any = {
            objectClass: this.objectId,
            values,
          };
          const chat = await this.$API.object.values.add(payload);
          this.addChatToCard(this.$_.get(chat, 'data.id'));
          this.cloneChatsId.push(this.$_.get(chat, 'data.id'));
          this.getChatList();
          this.openChat(this.$_.get(chat, 'data.id'))
          this.$store.dispatch('state/VIEW_NOTIFICATION', 'Чат создан');
        }
        this.form[this.nameKey] = null;
        this.form[this.userKey] = [];
        this.selectedForUsers = [];
        this.loading = false;
        this.openDialog = false;
      }
    } catch (e) {}
  }

  public async addChatToCard(id: any = 0) {
    const idChats: any = [];

    idChats.push(this.commentField);
    this.$set(idChats[0], 'value', this.cloneChatsId);
    if (id !== 0) {
      idChats[0].value.push(id);
    }
    const params = this.$route.params;
    const payloadChat: any = {
      id: Number(params.objectId),
      objectClass: Number(params.modelId),
      values: idChats,
    };
    await this.$API.object.values.edit(payloadChat);
    this.$emit('rules-update');
  }

  public startDeleteChat(id: any, index: number) {
    this.selectedChatToDelete = id;
    this.selectedIndexChatToDelete = index;
    this.changeDeleteDialogState(true);
  }

  public changeDeleteDialogState(state: boolean) {
    this.removeDialogActive = state;
  }

  public deleteChat(id: any) {
    try {
      this.$API.object.values.delete(this.selectedChatToDelete);
      this.cloneChatsId.splice(this.selectedIndexChatToDelete, 1);
      this.changeDeleteDialogState(false);
      this.addChatToCard();
      this.getChatList();
      this.$store.dispatch('state/VIEW_NOTIFICATION', 'Чат удален');
      this.selectedChatToDelete = 0;
      this.selectedIndexChatToDelete = 0;
    } catch (e) {}
  }

  public addItem(item: any) {
    if (this.form.creator !== item.id) {
      this.selectedForUsers.push(item);
      this.form[this.userKey].push(item.id);
    }
  }

  public removeItem(item: any) {
    if (this.form.creator !== item.id) {
      this.selectedForUsers = this.$_.remove(
        this.selectedForUsers,
        (el: any) => {
          return el.id !== item.id;
        },
      );
    }
    if (this.form.creator !== item.id) {
      this.form[this.userKey] = this.$_.remove(
        this.form[this.userKey],
        (el: any) => {
          return el !== item.id;
        },
      );
    }
  }
}
