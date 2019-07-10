<template>
  <v-layout>
    <v-content>
      <List></List>
    </v-content>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import List from '@/components/model/list/UniversalList.vue';

@Component({
  components: {
    List,
  },
})
export default class Card extends Vue {}
</script>
