<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4 max-width"
      >
        <v-card class="my-0">
          <v-layout
            align-center
            justify-space-between
            row
            fill-height
            class="pa-3"
          >
            <div class="display-1">Триггеры</div>
          </v-layout>

          <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1"
            :disable-initial-sort="true"
            hide-actions
            no-data-text="Нет данных"
          >
            <template v-slot:items="props">
              <tr>
                <td
                  class="link"
                  @click="viewItem(props.item.id)"
                >{{ props.item.name }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <infinite-loading
          spinner="spiral"
          @infinite="infiniteHandler"
          :identifier="infiniteId"
        >
          <div slot="no-more">
          </div>
          <div slot="no-results">
          </div>
        </infinite-loading>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
