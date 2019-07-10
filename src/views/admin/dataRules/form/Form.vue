<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-3 max-width"
      >
        <v-card class="my-0">
          <confirm-dialog
            :activator="removeDialogActive"
            :title="title"
            @success-callback="deleteFieldFinal()"
            @close-callback="deleteFieldUndo()"
            @toogle-state-callback="deleteFieldUndo()"
          >
          </confirm-dialog>
          <DataRulesFormDialog
            :getData="rulesItems"
            :dialog="openRuleSettings"
            :add="add"
            :getIndex="getIndex"
            @cancelDialog="cancelRuleDialog"
            @saveDialog="saveRuleDialog"
          >
          </DataRulesFormDialog>
          <DataRulesFormFieldDialog
            :dialog="openRuleFieldSettings"
            :getIndex="getIndex"
            :getData="schemaItems"
            @cancelDialog="cancelRuleFieldDialog"
            @saveDialog="saveRuleFieldDialog"
          ></DataRulesFormFieldDialog>
          <v-layout
            class="pl-3 pt-3"
            align-center
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
          <!-- <v-layout class="pl-3 pb-3">
            <v-btn
              outline
              class="ma-0"
              @click="addItem"
            >
              <v-icon class="mr-2">add</v-icon>
              <span>Добавить</span>
            </v-btn>
          </v-layout> -->
          <div class="pl-3 pt-3 pr-3">
            <v-flex>
              <div class="headline mb-3">
                Глобальные правила
              </div>
            </v-flex>
            <v-flex
              xs12
              v-for="(item, i) in rulesItems"
              :key="'rules-' + i"
              class="mb-3"
            >
              <v-layout
                row
                wrap
                fill-height
              >
                <v-flex xs11>
                  <v-text-field
                    label="Название правила"
                    v-model="rulesItems[i].name"
                    readonly
                    hide-details
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
            </v-flex>

            <v-flex
              xs1
              class="pl-0 pb-3"
            >
              <v-btn
                class="ma-0"
                @click="addRule"
              >
                <span>Добавить</span>
              </v-btn>
            </v-flex>

            <v-flex class="mt-3">
              <div class="headline mb-3">Правила для полей</div>
            </v-flex>

            <v-flex
              xs12
              v-for="(item, index) in schemaItems"
              :key="item.id*6"
              class="mb-3"
            >
              <v-layout
                row
                wrap
                fill-height
              >
                <v-flex xs11>
                  <v-text-field
                    label="Название поля"
                    v-model="schemaItems[index].name"
                    readonly
                    hide-details
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
                        @click.stop="openFieldRuleSettings(index)"
                      >
                        <v-icon
                          size="22"
                          color="grey darken-2"
                        >settings</v-icon>
                      </v-btn>
                    </div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </div>
          <v-layout
            align-center
            justify-end
            row
            fill-height
            class="px-3 pb-3"
          >
            <div class="mx-2">
              <v-btn
                flat
                class="ma-0"
                @click="$router.push({name: 'dataRules'})"
              >
                Отмена
              </v-btn>
            </div>
            <div>
              <v-btn
                class="ma-0 primary"
                @click="save"
              >
                Сохранить
              </v-btn>
            </div>
          </v-layout>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
