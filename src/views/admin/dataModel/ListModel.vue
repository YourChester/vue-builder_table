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
            <div class="display-1">Модели данных</div>
            <v-spacer></v-spacer>
            <v-btn
              outline
              class="ma-0"
              @click="$EventBus.$emit('VIEW_MODEL_CHANGE_DIALOG')"
            >
              <v-icon class="mr-2">add</v-icon>
              <span>Добавить</span>
            </v-btn>
          </v-layout>

          <ChangeDialog></ChangeDialog>

          <ConfirmDialog
            :title="'Удалить ' + $_.get(selectedModel, 'name', 'модель') + '?'"
            :activator="removeDialogActive"
            @success-callback="deleteCallback()"
            @close-callback="changeDeleteDialogState(false)"
            @toogle-state-callback="changeDeleteDialogState(!removeDialogActive)"
          >
          </ConfirmDialog>

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
                >{{ props.item.name }}</td>
                <td>
                  <v-layout>
                    <v-btn
                      @click="$EventBus.$emit('VIEW_MODEL_CHANGE_DIALOG', props.item.id)"
                      icon
                    >
                      <v-icon color="grey darken-2">edit</v-icon>
                    </v-btn>
                    <v-btn
                      @click="deleteModel(props.item)"
                      icon
                    >
                      <v-icon color="grey darken-2">delete</v-icon>
                    </v-btn>
                  </v-layout>
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
