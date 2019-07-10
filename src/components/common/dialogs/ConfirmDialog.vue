<template>
  <v-dialog
    v-model="isDialogActive"
    @keydown.esc="$emit('close-callback')"
    max-width="500"
  >
    <v-card class="pa-3">
      <v-card-title class="headline pt-0 pr-0 pb-3 pl-0">
        {{title}}
      </v-card-title>

      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn
          flat="flat"
          @click="$emit('close-callback')"
        >
          Нет
        </v-btn>

        <v-btn
          color="primary"
          @click="$emit('success-callback')"
        >
          Да
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'confirm-dialog',
})
export default class ConfirmDialog extends Vue {
  @Prop({ default: false }) public activator!: boolean;

  @Prop({ default: '' }) public title!: string;

  get isDialogActive(): boolean {
    return this.activator;
  }

  set isDialogActive(value: boolean) {
    this.$emit('toogle-state-callback', value);
  }
}
</script>
