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
            class="mb-3"
          >
            <div class="display-1 px-4 pt-4">Представления реестров</div>
            <v-spacer></v-spacer>
            <div class="px-4 pt-4">
              <v-btn
                @click="goToCard()"
                flat
                outline
                class="ma-0"
              >
                <v-icon class="mr-2">
                  add
                </v-icon>
                Добавить
              </v-btn>
            </div>
          </v-layout>

          <ConfirmDialog
            :title="'Удалить ' + $_.get(selectedModel, 'props.name', 'представление') + '?'"
            :activator="removeDialogActive"
            @success-callback="deleteCallback()"
            @close-callback="changeDeleteDialogState(false)"
            @toogle-state-callback="changeDeleteDialogState(!removeDialogActive)"
          >
          </ConfirmDialog>

          <v-alert
            :value="errorMsg"
            type="error"
            class="mb-3 mx-3"
            outline
          >
            {{ errorMsg }}
          </v-alert>

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
                  @click="openDialog(props.item.id)"
                >{{ props.item.props.name }}</td>
                <td>
                  <v-btn
                    @click="deleteModel(props.item)"
                    flat
                    icon
                  >
                    <v-icon color="grey darken-2">
                      delete
                    </v-icon>
                  </v-btn>
                </td>
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
<style src="./style.scss" lang="scss"></style>
