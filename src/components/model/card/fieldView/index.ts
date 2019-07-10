import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'field-view',
})
export default class FieldView extends Vue {
  @Prop({ default: null }) public avatar!: any;
  @Prop({ default: '' }) public title!: any;
  @Prop({ default: '' }) public value!: any;
  @Prop({ default: '' }) public icon!: any;
}
