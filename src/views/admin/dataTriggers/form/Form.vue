<template>
  <v-layout>
    <Toolbar></Toolbar>

    <DataTriggersDialog></DataTriggersDialog>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-3 max-width"
      >
        <v-card class="my-0 pa-3">
          <v-layout
            class="mb-3"
            align-center
          >
            <v-btn
              icon
              class="my-0 ml-0 mr-2"
              @click="$router.go(-1)"
            >
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <span class="mr-2 display-1">{{ $_.get(objectClass, 'name', 'Неизвестная модель') }}</span>
            <span class="body-2 grey--text text--darken-1">триггеры</span>
          </v-layout>

          <v-btn
            outline
            class="ma-0"
            @click="$EventBus.$emit('VIEW_TRIGGER_CHANGE_DIALOG', $_.get(objectClass, 'id'))"
          >
            <v-icon class="mr-2">add</v-icon>
            <span>Добавить</span>
          </v-btn>

          <v-alert
            :value="error"
            type="error"
            class="my-3"
            outline
          >
            {{ error }}
          </v-alert>

          <v-data-table
            :headers="headers"
            :items="items"
            class="mt-3"
            :disable-initial-sort="true"
            hide-actions
            no-data-text="Нет данных"
          >
            <template v-slot:items="props">
              <tr>
                <td
                  class="link"
                  @click="$EventBus.$emit('VIEW_TRIGGER_CHANGE_DIALOG', $_.get(objectClass, 'id'), $_.get(props, 'item.id'))"
                >
                  {{ $_.get(props.item, 'name') }}
                </td>
                <td>
                  <v-btn
                    @click="deleteItem($_.get(props, 'item'))"
                    icon
                  >
                    <v-icon color="grey darken-2">delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

          <ConfirmDialog
            :title="'Удалить триггер?'"
            :activator="removeDialogActive"
            @success-callback="deleteCallback()"
            @close-callback="changeDeleteDialogState(false)"
            @toogle-state-callback="changeDeleteDialogState(!removeDialogActive)"
          >
          </ConfirmDialog>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
