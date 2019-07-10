<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4 max-width"
      >
        <v-card class="my-0">
          <DataModelFormDialog
            :dialog="openSpecialSettingsDialog"
            :schemaItemsProp="schemaItems"
            :add='addField'
            :typeItemsProp="typeItems"
            :specialIndexProp="specialIndex"
            @saveDialog="onSaveDialog"
            @cancelDialog="onCancelDialog"
          ></DataModelFormDialog>
          <confirm-dialog
            :activator="removeDialogActive"
            :title="title"
            @success-callback="deleteFieldFinal()"
            @close-callback="deleteFieldUndo()"
            @toogle-state-callback="deleteFieldUndo()"
          >
          </confirm-dialog>

          <v-layout
            align-center
            class="pa-3"
          >
            <v-btn
              icon
              class="my-0 ml-0 mr-2"
              @click="$router.go(-1)"
            >
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <div class="display-1">{{ $_.get(objectClass, 'name', 'Модель') }}</div>
          </v-layout>
          <v-layout class="px-3">
            <v-btn
              outline
              class="ma-0"
              @click="addItem"
            >
              <v-icon class="mr-2">add</v-icon>
              <span>Добавить</span>
            </v-btn>
          </v-layout>

          <div
            class="pa-3"
            v-if="!$_.get(schemaItems, 'length')"
          >
            Нет данных
          </div>

          <div
            class="pa-3"
            v-else
          >
            <v-flex
              xs12
              v-for="(item, index) in schemaItems"
              :key="index"
              :class="{'mb-3': index !== $_.get(schemaItems, 'length') - 1}"
            >
              <v-layout
                row
                wrap
                fill-height
                align-center
              >
                <v-flex xs4>
                  <v-text-field
                    label="Название поля"
                    v-model="schemaItems[index].name"
                    readonly
                    hide-details
                  >
                  </v-text-field>
                </v-flex>
                <v-flex
                  xs4
                  class="px-2"
                >
                  <v-text-field
                    label="Ключ поля"
                    v-model="schemaItems[index].key"
                    readonly
                    hide-details
                  >
                  </v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items="typeItems"
                    item-text="text"
                    item-value="value"
                    label="Тип поля"
                    v-model="schemaItems[index].type"
                    readonly
                    hide-details
                  ></v-select>
                </v-flex>
                <v-flex xs1>
                  <v-layout
                    align-center
                    justify-center
                    row
                    fill-height
                  >
                    <div class="px-2 pt-3">
                      <v-btn
                        icon
                        class="ma-0"
                        @click.stop="openSpecialSettings(index, item)"
                      >
                        <v-icon
                          size="22"
                          color="grey darken-2"
                        >settings</v-icon>
                      </v-btn>
                    </div>
                    <div class="pt-3">
                      <v-btn
                        icon
                        class="ma-0"
                        @click="deleteField(index)"
                      >
                        <v-icon
                          size="22"
                          color="grey darken-2"
                        >delete</v-icon>
                      </v-btn>
                    </div>

                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </div>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
