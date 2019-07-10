<template>
  <v-layout>
    <Toolbar></Toolbar>

    <v-content>
      <v-container
        fluid
        class="container-wrap pa-3 max-width"
      >
        <v-card class="my-0">
          <div class="pa-3">
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
              <div class="display-1">
                Настройка меню
              </div>
            </v-layout>

            <v-layout
              row
              wrap
              fill-height
            >
              <v-flex
                xs3
                class="rulesBorder"
              >
                <div
                  v-for="(item, i) in objectRoles"
                  :key="i"
                  class="px-2 py-2"
                  :class="{ primary: roleId === item.id, 'white--text': roleId === item.id }"
                  @click="openRole(item)"
                >
                  {{ item.name }}
                </div>
              </v-flex>
              <v-flex
                xs9
                class="objBorder"
              >
                <v-layout
                  v-if="!roleId"
                  class="pa-3"
                  align-center
                  justify-center
                  fill-height
                  column
                >
                  <v-icon class="grey--text">supervisor_account</v-icon>
                  <div class="grey--text">Выберите роль</div>
                </v-layout>
                <template v-if="roleId">
                  <v-flex
                    v-for="(item, i) in objectItems"
                    :key="i"
                    xs12
                  >
                    <v-layout
                      row
                      wrap
                      align-center
                      fill-height
                    >
                      <v-flex
                        xs6
                        class="pa-2"
                      >
                        {{ item.name }}
                      </v-flex>
                      <v-flex xs6>
                        <v-checkbox
                          label="Доступно в меню"
                          color="primary"
                          class="my-2 pa-0"
                          hide-details
                          v-model="objectItems[i].visible"
                        ></v-checkbox>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex>
                    <v-layout
                      row
                      wrap
                      fill-height
                    >
                      <v-flex
                        xs6
                        class="pa-2"
                      >
                        Конфигурация
                      </v-flex>
                      <v-flex xs6>
                        <v-checkbox
                          label="Доступно в меню"
                          color="primary"
                          class="my-2 pa-0"
                          hide-details
                          v-model="cons"
                        ></v-checkbox>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex class="mx-2">
                    <v-select
                      :items="objectItems"
                      item-text="name"
                      item-value="id"
                      label="Главная страница"
                      v-model="mainId"
                    ></v-select>
                  </v-flex>
                  <v-flex>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      class="my-2 mr-1"
                      @click="saveMenuRule()"
                    >Сохранить</v-btn>
                    <v-btn
                      flat
                      @click="cancelBtn()"
                    >Отмена</v-btn>
                  </v-flex>
                </template>
              </v-flex>
            </v-layout>
          </div>
        </v-card>
      </v-container>
    </v-content>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
                  