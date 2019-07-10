<template>
  <v-card ref="form">
    <v-dialog
      v-model="openSpecialSettingsDialog"
      width="800"
      lazy
      persistent
    >
      <v-card>
        <v-form ref="form">
          <v-card-title
            class="display-1 grey lighten-2"
            primary-title
          >
            Настройка поля
          </v-card-title>
          <v-container>
            <v-layout
              row
              wrap
              v-if="newSchemaItems[specialIndex]"
            >
              <v-flex xs12>
                <v-container
                  grid-list-md
                  text-xs-center
                  align-center
                  justify-center
                  align-content-center
                  class="pa-0"
                >
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex xs4>
                      <v-text-field
                        label="Название поля"
                        v-model="newSchemaItems[specialIndex].name"
                        :rules="[rules.required]"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        label="Ключ поля"
                        v-model="newSchemaItems[specialIndex].key"
                        :rules="[rules.required, rules.latinOnly]"
                      >
                      </v-text-field>
                    </v-flex>
                    <v-flex xs4>
                      <v-select
                        :items="typeItems"
                        item-text="text"
                        item-value="value"
                        :rules="[rules.required]"
                        label="Тип поля"
                        v-model="newSchemaItems[specialIndex].type"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
              <v-flex
                class="py-0"
                v-if="newSchemaItems[specialIndex].props"
              >
                <v-switch
                  color="primary"
                  v-model="newSchemaItems[specialIndex].props.required"
                  label="Обязательное поле"
                  class="ma-0 pa-0"
                  hide-details
                ></v-switch>
              </v-flex>
              <v-flex
                xs12
                v-if="newSchemaItems[specialIndex].type === 'OBJECT'"
              >
                <v-flex>
                  <v-layout class="mb-4">
                    <v-flex xs4>
                      <v-switch
                        color="primary"
                        label="Множественное поле"
                        :disabled="newSchemaItems[specialIndex].props.type === 'file'"
                        v-model="newSchemaItems[specialIndex].props.object.multiple"
                        hide-details
                      ></v-switch>
                      <v-switch
                        label="Kostil"
                        v-model="newSchemaItems[specialIndex].props.object.kostil"
                        color="primary"
                        messages="Сравнение по группам пользователей"
                      ></v-switch>
                      <v-switch
                        v-if="newSchemaItems[specialIndex].props.type === 'comments'"
                        label="Отображение в истории"
                        v-model="newSchemaItems[specialIndex].props.object.versioning"
                        color="primary"
                        messages="Версионирование поля"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        label="Reference cascade delete"
                        v-model="newSchemaItems[specialIndex].props.object.cascade"
                        color="primary"
                        messages="Каскадное удаление"
                      ></v-switch>
                      <v-switch
                        label="Reference cascade save"
                        v-model="newSchemaItems[specialIndex].props.object.cascadeSave"
                        color="primary"
                        messages="Каскадное сохранение"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        label="Reference validated"
                        v-model="newSchemaItems[specialIndex].props.object.validated"
                        color="primary"
                        messages="Использование правил объекта"
                      ></v-switch>
                    </v-flex>
                  </v-layout>

                  <v-layout
                    row
                    wrap
                  >
                    <v-flex xs4>
                      <v-select
                        :items="typeItemsList"
                        item-text="text"
                        item-value="value"
                        :rules="[rules.required]"
                        label="Тип"
                        v-model="newSchemaItems[specialIndex].props.type"
                        @change="changeViewSrc(specialIndex, newSchemaItems[specialIndex].props.object.reference, newSchemaItems[specialIndex].props.type)"
                        hide-details
                      ></v-select>
                    </v-flex>

                    <v-flex
                      xs4
                      v-if="viewListSrc"
                    >
                      <v-select
                        :items="typeItemsListSrc"
                        item-text="name"
                        item-value="id"
                        label="Источник данных"
                        class="mx-1"
                        v-model="newSchemaItems[specialIndex].props.object.reference"
                        @change="changeTypeItemsListSrc(specialIndex, newSchemaItems[specialIndex].props.object.reference, newSchemaItems[specialIndex].props.type)"
                        no-data-text="Нет данных"
                        hide-details
                      ></v-select>
                    </v-flex>

                    <v-flex
                      xs4
                      v-if="newSchemaItems[specialIndex].props.object.reference"
                    >
                      <v-select
                        v-if="newSchemaItems[specialIndex].props.type === 'file'"
                        :items="typeItemsListField"
                        item-text="name"
                        item-value="key"
                        label="Поле файла"
                        v-model="newSchemaItems[specialIndex].props.object.fileField"
                        no-data-text="Нет данных"
                        hide-details
                      ></v-select>
                      <v-select
                        v-else-if="newSchemaItems[specialIndex].props.type !== 'chat'"
                        :items="typeItemsListField"
                        item-text="name"
                        item-value="key"
                        label="Текстовое поле"
                        v-model="newSchemaItems[specialIndex].props.object.textField"
                        no-data-text="Нет данных"
                        hide-details
                      ></v-select>
                    </v-flex>

                  </v-layout>
                </v-flex>
              </v-flex>
              <v-flex
                xs12
                v-if="newSchemaItems[specialIndex].type === 'STRING'"
              >
                <v-flex>
                  <v-select
                    :items="typeItemsText"
                    item-text="text"
                    item-value="value"
                    :rules="[rules.required]"
                    label="Тип текста"
                    v-model="newSchemaItems[specialIndex].props.type"
                    hide-details
                  > </v-select>
                </v-flex>
              </v-flex>
              <v-flex
                xs12
                v-if="newSchemaItems[specialIndex].type === 'HISTORY'"
              >
                <v-flex>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex
                      xs6
                      class="pr-2"
                    >
                      <v-select
                        :items="typeItemsFields"
                        item-text="name"
                        item-value="id"
                        label="Разделитель ключ"
                        class="mb-3"
                        v-model="newSchemaItems[specialIndex].props.divider.key"
                        hide-details
                        return-object
                        @change="initItemsValues"
                      > </v-select>
                    </v-flex>
                    <v-flex
                      xs6
                      class="pr-2"
                    >
                      <v-select
                        :items="typeItemsValues"
                        item-text="name"
                        item-value="id"
                        label="Разделитель значение"
                        class="mb-3"
                        v-model="newSchemaItems[specialIndex].props.divider.value"
                        hide-details
                      > </v-select>
                    </v-flex>
                    <v-flex xs3>
                      <v-btn
                        class="mx-0 mb-0 mb-3"
                        @click="addRuleForHistory"
                      >Добавить</v-btn>
                    </v-flex>
                    <v-flex xs3>
                      <v-switch
                        label="Отображение в истории"
                        v-model="newSchemaItems[specialIndex].props.object.versioning"
                        color="primary"
                        class="mt-0"
                        hide-details
                      ></v-switch>
                    </v-flex>
                    <v-flex xs6>
                    </v-flex>

                  </v-layout>
                  <v-flex
                    v-for="(item, i) in newSchemaItems[specialIndex].props.history"
                    :key="i"
                  >
                    <v-layout
                      row
                      wrap
                      class="mb-3"
                    >
                      <v-flex
                        xs4
                        class="pr-2"
                      >
                        <v-select
                          :items="typeItemsRoles"
                          item-text="name"
                          item-value="id"
                          label="Роли"
                          class="mb-3"
                          multiple
                          v-model="item.roles"
                          hide-details
                        > </v-select>
                      </v-flex>
                      <v-flex
                        xs4
                        class="pr-2"
                      >
                        <v-select
                          :items="typeItemsFields"
                          item-text="name"
                          item-value="id"
                          label="Поля"
                          class="mb-3"
                          multiple
                          v-model="item.fields"
                          hide-details
                        > </v-select>
                      </v-flex>
                      <v-flex xs3>
                      </v-flex>
                      <v-flex xs1>
                        <v-btn
                          icon
                          @click="deleteRuleForHistory(i)"
                        >
                          <v-icon color="grey">delete</v-icon>
                        </v-btn>
                      </v-flex>
                      <v-flex xs12>
                        <editor
                          v-model="item.json"
                          @init="editorInit"
                          lang="json"
                          theme="chrome"
                          width="700"
                          height="100"
                        ></editor>
                      </v-flex>
                    </v-layout>
                    <v-divider
                      class="mb-3"
                      v-if="i !== newSchemaItems[specialIndex].props.history.length - 1"
                    ></v-divider>
                  </v-flex>
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
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
                  
                  