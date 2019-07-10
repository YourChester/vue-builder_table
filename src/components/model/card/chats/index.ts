import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ChatList from './list/List.vue';
import ChatItem from './item/Item.vue';

@Component({
  name: 'chats',
  components: { ChatList, ChatItem },
})
export default class Chats extends Vue {
  @Prop({ default: null }) public objectId!: any;

  @Prop({ default: null }) public commentField!: any;

  @Prop({ default: null }) public cardAccess!: any;

  @Prop({ default: null }) public reference!: any;

  @Prop({ default: null }) public idChats!: any;

  public reset = false;

  public cerentIdChat: number = 0;

  public idForObject: number = 0;

  public fieldForMessage: any = {};

  public fieldForUsers: any = {};

  public cardAccessForChat: any = [];

  public cardAccess1: any = {};

  public users: any = [];

  public creator: any = {};

  public async openChat(val: any) {
    if (this.cerentIdChat === val) {
      return;
    }

    const result = await this.$API.object.values.get(val);

    const data = this.$_.clone(result.data.values);
    let userIdList = [];

    for (const item of data) {
      if (this.$_.get(item, 'type') === 'OBJECT') {
        switch (this.$_.get(item, 'props.type')) {
          case 'user':
            userIdList = this.$_.get(item, 'value');
            this.fieldForUsers = item;
            break;

          case 'comments':
            this.fieldForMessage = this.$_.clone(item);
            break;

          default:
            break;
        }

        switch (this.$_.get(item, 'key')) {
          case 'user':
            this.creator = this.$_.clone(this.$_.get(item, 'value', null));
            break;

          default:
            break;
        }
      }
    }

    this.loadUsers(userIdList);
    this.getRules(result.data);

    this.reset = true;
    const vm = this;
    setTimeout(() => {
      vm.reset = false;
    }, 200);
    this.cerentIdChat = val;
  }

  public async getRules(item: any) {
    try {
      const objectClassId = Number(item.objectClass);
      const objectId = Number(item.id);
      const queries: any = [];

      if (objectId) {
        queries.push(
          this.$API.object.rules.execute({
            action: 'ADD',
            objectClass: objectClassId,
            objectCard: objectId,
          }),
        );
        queries.push(
          this.$API.object.rules.execute({
            action: 'VIEW',
            objectClass: objectClassId,
            objectCard: objectId,
          }),
        );

        queries.push(
          this.$API.object.rules.execute({
            action: 'EDIT',
            objectClass: objectClassId,
            objectCard: objectId,
          }),
        );

        queries.push(
          this.$API.object.rules.execute({
            action: 'DELETE',
            objectClass: objectClassId,
            objectCard: objectId,
          }),
        );
      } else {
        queries.push(
          this.$API.object.rules.execute({
            action: 'ADD',
            objectClass: objectClassId,
          }),
        );
      }

      const result = await Promise.all(queries);

      // ADD object
      const resultRulesAdd = this.$_.get(result, '0.data', {});
      const resultRulesView = this.$_.get(result, '1.data', {});
      const resultRulesEdit = this.$_.get(result, '2.data', {});
      const resultRulesDelete = this.$_.get(result, '3.data', {});

      // Формируем объект правил
      this.cardAccessForChat = {
        add: resultRulesAdd,
        view: resultRulesView,
        edit: resultRulesEdit,
        delete: resultRulesDelete,
      };
    } catch (e) {}
  }

  public updateRules() {
    this.$emit('update-rules-for-card')
  }

  public async loadUsers(userIdList: any) {
    try {
      if (!this.$_.get(userIdList, 'length')) {
        this.users = [];
        return;
      }

      const payload = {
        include: userIdList,
        size: 100,
        postprocess: true,
      };
      const result = await this.$API.users.list(payload);
      this.users = this.$_.get(result, 'data.content', []);
    } catch (e) {}
  }
}
