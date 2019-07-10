<template>
  <v-card>
    <v-dialog
      v-model="openDialog"
      width="800"
      lazy
      persistent
    >
      <v-card>
        <DataRulesFormDialog
          :getData="items"
          :dialog="openRuleSettings"
          :add="newAdd"
          :getIndex="newIndex"
          @cancelDialog="cancelRuleDialog"
          @saveDialog="saveRuleDialog"
        >
        </DataRulesFormDialog>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Настройка правила
        </v-card-title>
        <v-container
          grid-list-md
          text-xs-center
        >
          <v-layout
            row
            wrap
          >
            <v-flex v-if="data">
              <v-flex
                xs12
                v-for="(item, i) in items"
                :key="i"
              >
                <v-container
                  grid-list-md
                  text-xs-center
                  class="pa-0"
                >
                  <v-layout
                    row
                    wrap
                    fill-height
                  >
                    <v-flex xs11>
                      <v-text-field
                        label="Название правила"
                        v-model="items[i].name"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs1>
                      <v-layout
                        align-center
                        justify-center
                        row
                        fill-height
                      >
                        <div class="px-1 pt-3">
                          <v-btn
                            icon
                            class="ma-0"
                            @click.stop="openRuleSettingsDialog(i)"
                          >
                            <v-icon
                              size="22"
                              color="grey darken-2"
                            >settings</v-icon>
                          </v-btn>
                        </div>
                        <div class="px-1 pt-3">
                          <v-btn
                            icon
                            class="ma-0"
                            @click="deleteField(i)"
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
                </v-container>
              </v-flex>
              <v-flex
                xs1
                class="pl-0 pb-4"
              >
                <v-btn
                  flat
                  outline
                  class="ma-0"
                  @click="addRule"
                >
                  <span>Добавить</span>
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="cancelDialog"
          >
            Отменить
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="saveDialog"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
                  
                  