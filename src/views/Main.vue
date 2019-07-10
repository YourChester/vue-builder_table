<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4"
      >
        <v-card class="my-0">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-3">Внимание</h3>
              <p>Представление по умолчанию не настроено.<br />
                Перейдите в настройки меню и настройте представление, которое будет использоваться в качестве главной страницы.</p>
              <v-btn
                class="ma-0 primary"
                :to="{name:'menuRules'}"
              >Настройки меню</v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Toolbar from '@/components/header/toolbar/Toolbar.vue';

@Component({
  name: 'Main',
  components: { Toolbar },
})
export default class Main extends Vue {}
</script>
