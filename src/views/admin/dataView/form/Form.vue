<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-4 max-width"
      >
        <v-card
          class="elevation-2 pa-3"
          min-height="500"
        >
          <v-layout
            align-center
            class="mb-3"
          >
            <v-btn
              icon
              class="my-0 ml-0 mr-2"
              @click="$router.go(-1)"
            >
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <div class="display-1">{{ $_.get(objectClass, 'name', 'Представление') }}</div>
            <v-spacer></v-spacer>
            <div>
              <v-btn
                flat
                @click="$router.push({ name: 'dataView' });"
              >
                Отмена
              </v-btn>
            </div>
            <div>
              <v-btn
                :disabled="!$_.get(layout, 'length') || loading"
                :loading="loading"
                @click="saveDataView()"
                color="primary"
              >
                Сохранить
              </v-btn>
            </div>
          </v-layout>

          <v-alert
            :value="errorMsg"
            type="error"
            class="mb-3"
            outline
          >
            {{ errorMsg }}
          </v-alert>

          <v-layout
            align-center
            justify-start
            row
            fill-height
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
              v-model="objectClassId"
              @change="getFields()"
            >
            </v-select>
          </v-layout>

          <v-layout>
            <v-flex
              md3
              class="border mr-2"
            >
              <v-list
                v-show="fields.length > 0 ? true : false"
                class="pa-0"
                v-for="(item, index) in fields"
                :key="index"
              >
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.name"></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn
                      flat
                      icon
                      @click="addField(item, index)"
                    >
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-list-tile-action>

                </v-list-tile>
                <v-divider
                  v-if="index + 1 < fields.length"
                  :key="`divider-${index}`"
                ></v-divider>
              </v-list>
              <v-list
                v-show="fields.length > 0 ? false : true"
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
              md9
              class="border"
            >
              <grid-layout
                :layout.sync="layout"
                :col-num="12"
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
                  class="elevation-2 primary white--text px-2"
                >
                  <v-layout align-center>
                    <div v-if="item.i">
                      {{item.i.name}}
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
                            @click="deleteField(item, index)"
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
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
