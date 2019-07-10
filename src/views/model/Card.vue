<template>
  <v-layout>
    <Toolbar></Toolbar>
    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4"
      >
        <v-card class="my-0">
          <model-card></model-card>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModelCard from '@/components/model/card/Card.vue';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';

@Component({
  components: {
    ModelCard,
    Toolbar,
  },
})
export default class Card extends Vue {
  public created() {
    const configId = this.$_.get(this.$router.currentRoute, 'params.configId');
    const modelId = this.$_.get(this.$router.currentRoute, 'params.modelId');
  }
}
</script>
