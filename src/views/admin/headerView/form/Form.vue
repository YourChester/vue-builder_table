<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4 max-width"
      >
        <v-card class="elevation-2">
          <div class="pa-3">

            <v-layout align-center>
              <v-btn
                icon
                class="my-0 ml-0 mr-2"
                @click="$router.go(-1)"
              >
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <div class="display-1">Представление</div>
            </v-layout>

            <v-alert
              :value="errorMsg"
              type="error"
              class="mt-3"
              outline
            >
              {{ errorMsg }}
            </v-alert>
          </div>

          <v-layout
            align-center
            justify-start
            row
            fill-height
            class="px-3"
          >
            <v-text-field
              label="Название"
              v-model="schemaName"
              class="mr-3"
            >
            </v-text-field>

            <v-select
              label="Класс"
              item-text="name"
              item-value="id"
              :items="classList"
              v-model="selectClass"
              @change="getFieldsOfClass()"
            >
            </v-select>

          </v-layout>
          <v-tabs
            v-model="activeTabs"
            color="white"
            slider-color="blue darken-4"
            class="pa-3"
            grow
          >
            <v-tab class="blue--text text--darken-4">
              Шапка таблицы
            </v-tab>
            <v-tab class="blue--text text--darken-4">
              Фильтры
            </v-tab>
            <v-tab-item>
              <v-layout class="py-3">
                <v-spacer></v-spacer>
                <div>
                  <v-btn
                    flat
                    @click="$router.push({ name: 'headerView' });"
                    class="my-0 mx-1"
                  >
                    Отмена
                  </v-btn>
                </div>
                <div>
                  <v-btn
                    :disabled="save"
                    :loading="save"
                    @click="saveItem()"
                    color="primary"
                    class="ma-0"
                  >
                    Сохранить
                  </v-btn>
                </div>
              </v-layout>
              <v-layout>
                <v-flex
                  md2
                  class="border mr-2"
                >
                  <v-list
                    v-show="$_.get(fields, 'length', 0) > 0 ? true : false"
                    class="pa-0"
                  >
                    <template v-for="(item, index) in fields">
                      <v-list-tile :key="index">

                        <v-list-tile-content>
                          <v-list-tile-title v-text="item.name"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-btn
                            flat
                            icon
                            @click="addItem(item, index)"
                          >
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-list-tile-action>

                      </v-list-tile>
                      <v-divider
                        v-if="index + 1 < $_.get(fields, 'length', 0)"
                        :key="`divider-${index}`"
                      ></v-divider>
                    </template>
                  </v-list>
                  <v-list
                    v-show="$_.get(fields, 'length', 0) > 0 ? false : true"
                    class="pa-0"
                  >
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title
                          class="text-xs-center"
                          v-text="'Нет полей'"
                        >
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex
                  md10
                  class="border"
                >
                  <grid-layout
                    :layout.sync="layout"
                    :col-num="20"
                    :max-rows="1"
                    :row-height="40"
                    :is-draggable="true"
                    :is-resizable="true"
                    :is-mirrored="false"
                    :vertical-compact="true"
                    :margin="[5, 5]"
                    :use-css-transforms="true"
                  >
                    <grid-item
                      v-for="(item, index) in layout"
                      :key="index"
                      :x="item.x"
                      :y="item.y"
                      :w="item.w"
                      :h="item.h"
                      :i="item.i"
                      :max-h="1"
                      :min-w="2"
                      class="elevation-2 primary white--text px-2"
                    >
                      <v-layout align-center>
                        <div>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <span v-on="on">{{validName(item.i.name)}}</span>
                            </template>
                            <span>{{item.i.name}}</span>
                          </v-tooltip>

                        </div>
                        <v-spacer></v-spacer>
                        <div>
                          <v-btn
                            flat
                            icon
                            small
                            dark
                            @click="show($event, index)"
                          >
                            <v-icon>
                              more_vert
                            </v-icon>
                          </v-btn>
                        </div>
                      </v-layout>
                      <v-menu
                        v-model="showMenu[index]"
                        :position-x="x"
                        :position-y="y"
                        absolute
                        offset-y
                        class="primary"
                      >
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-content>
                              <span
                                @click="deleteItem(item.i, index)"
                                class="pointer"
                              >Удалить</span>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </grid-item>
                  </grid-layout>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout class="py-3">
                <v-spacer></v-spacer>
                <div>
                  <v-btn
                    flat
                    class="mx-1 my-0"
                    @click="$router.push({ name: 'headerView' });"
                  >
                    Отмена
                  </v-btn>
                </div>
                <div>
                  <v-btn
                    @click="saveItemFilter()"
                    color="primary"
                    :disabled="save"
                    :loading="save"
                    class="ma-0"
                  >
                    Сохранить
                  </v-btn>
                </div>
              </v-layout>
              <v-layout>
                <v-flex
                  md2
                  class="border mr-2"
                >
                  <v-list
                    v-show="$_.get(filters, 'length', 0) > 0 ? true : false"
                    class="pa-0"
                  >
                    <template v-for="(item, index) in filters">
                      <v-list-tile :key="index">

                        <v-list-tile-content>
                          <v-list-tile-title v-text="item.name"></v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                          <v-btn
                            flat
                            icon
                            @click="addFilterItem(item, index)"
                          >
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-list-tile-action>

                      </v-list-tile>
                      <v-divider
                        v-if="index + 1 < $_.get(filters, 'length', 0)"
                        :key="`divider-${index}`"
                      ></v-divider>
                    </template>
                  </v-list>
                  <v-list
                    v-show="$_.get(filters, 'length', 0) > 0 ? false : true"
                    class="pa-0"
                  >
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title
                          class="text-xs-center"
                          v-text="'Нет полей'"
                        >
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex
                  md10
                  class="border"
                >
                  <grid-layout
                    :layout.sync="layoutFiltr"
                    :col-num="12"
                    :max-rows="2"
                    :row-height="40"
                    :is-draggable="true"
                    :is-resizable="true"
                    :is-mirrored="false"
                    :vertical-compact="false"
                    :margin="[5, 5]"
                    :use-css-transforms="true"
                  >
                    <grid-item
                      v-for="(item, index) in layoutFiltr"
                      :key="index"
                      :static="item.i.name === 'logo' || item.i.name === 'notification'"
                      :x="item.x"
                      :y="item.y"
                      :w="item.w"
                      :h="item.h"
                      :i="item.i"
                      :max-h="1"
                      class="elevation-2 primary white--text px-2"
                    >
                      <v-layout align-center>
                        <div>
                          {{item.i.name}}
                        </div>
                        <v-spacer></v-spacer>
                        <div>
                          <v-btn
                            flat
                            icon
                            small
                            dark
                            v-if="item.i.name !== 'logo' && item.i.name !== 'notification'"
                            @click="showMenuFilter($event, index)"
                          >
                            <v-icon>
                              more_vert
                            </v-icon>
                          </v-btn>
                        </div>
                      </v-layout>
                      <v-menu
                        v-model="showFilterMenu[index]"
                        :position-x="x"
                        :position-y="y"
                        absolute
                        offset-y
                        class="primary"
                      >
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-content>
                              <span
                                @click="deleteFilterItem(item.i, index)"
                                class="pointer"
                              >Удалить</span>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </grid-item>

                  </grid-layout>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex md6>
                  <div class="mt-4 mb-3 title">JSON</div>
                  <editor
                    v-model="jsonRaw"
                    @init="editorInit"
                    lang="json"
                    theme="chrome"
                    width="500"
                    height="400"
                  ></editor>
                </v-flex>
                <v-flex md6>
                  <div class="mt-4 mb-3 title">
                    Настройки поиска:
                    <v-switch
                      v-model="searchById"
                      color="primary"
                      label="Поиск по id "
                    ></v-switch>
                  </div>

                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-container>
    </v-content>
    <v-snackbar
      v-model="snackbar"
      top
      color="error"
    >
      <span>Поля не стоят в одну линию!</span>
      <v-btn
        color="white"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFilter"
      top
      color="error"
    >
      <span>{{snackbarFilterText}}</span>
      <v-btn
        color="white"
        flat
        @click="snackbarFilter = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
