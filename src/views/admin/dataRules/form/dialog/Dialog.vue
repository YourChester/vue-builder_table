<template>
  <v-card>
    <v-dialog
      v-model="openDialog"
      width="1200"
      lazy
      persistent
    >
      <v-card>
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
            <v-flex v-if="data[getIndex]">
              <!--
              <v-flex xs12>
                  <v-select
                  :items="patternData"
                  item-text="name"
                  label="Шаблоны"
                  return-object
                  v-model="pattern"
                > </v-select>
              </v-flex>
              -->
              <v-flex xs12>
                <v-text-field
                  label="Имя поля"
                  v-model="data[getIndex].name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :items="actionData"
                  item-text="text"
                  item-value="text"
                  label="Права"
                  multiple
                  v-model="data[getIndex].actions"
                > </v-select>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :items="roleData"
                  item-text="name"
                  item-value="id"
                  label="Роли"
                  multiple
                  v-model="data[getIndex].roles"
                > </v-select>
              </v-flex>
              <v-divider></v-divider>
              <v-flex
                xs12
                v-if="data[getIndex]"
              >
                <v-layout
                  row
                  wrap
                >
                  <!-- Заглушка под будущий конструктор правил  -->
                  <!-- <v-layout
                  row
                  wrap
                >
                  <v-flex xs4>
                    <v-btn>Добавить</v-btn>
                  </v-flex>
                  <v-flex xs4>
                    <v-select
                      :items="rulesOperatorSelect"
                      item-text="text"
                      item-value="value"
                      label="Оператор"
                    > </v-select>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                >
                  Оператор И
                  <v-flex
                    xs12
                    v-for="(item, i) in rulesForAnd"
                    :key="i"
                  >
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex xs4>
                        <v-select
                          :items="typeForRules"
                          item-text="text"
                          item-value="value"
                          label="type"
                          v-model="rulesForAnd[i].type"
                        > </v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-select
                          :items="targetForRules"
                          item-text="text"
                          item-value="value"
                          label="target"
                          v-model="rulesForAnd[i].target"
                        > </v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-text-field
                          label="value"
                          v-model="rulesForAnd[i].value"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                >
                  Оператор ИЛИ
                  <v-flex
                    xs12
                    v-for="(item, i) in rulesForOr"
                    :key="i"
                  >
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex xs4>
                        <v-select
                          :items="typeForRules"
                          item-text="text"
                          item-value="value"
                          label="type"
                          v-model="rulesForOr[i].type"
                        > </v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-select
                          :items="targetForRules"
                          item-text="text"
                          item-value="value"
                          label="target"
                          v-model="rulesForOr[i].target"
                        > </v-select>
                      </v-flex>
                      <v-flex xs4>
                        <v-text-field
                          label="value"
                          v-model="rulesForOr[i].value"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout> -->
                  <!-- <highlight-code
                  lang="JSON"
                  v-model="data[getIndex].json"
                > -->
                  <v-flex
                    xs6
                    class="pr-4"
                  >
                    <editor
                      v-if="data[getIndex]"
                      v-model="data[index].json"
                      @init="editorInit"
                      lang="json"
                      theme="chrome"
                      width="300"
                      height="300"
                    ></editor>
                  </v-flex>
                  <v-flex xs6>
                    <editor
                      v-if="data[getIndex]"
                      v-model="data[index].json2"
                      @init="editorInit"
                      lang="json"
                      theme="chrome"
                      width="300"
                      height="300"
                    ></editor>
                  </v-flex>
                  <!--
                      <v-textarea
                      auto-grow
                      name="inputJSON"
                      label="JSON"
                      v-model="data[getIndex].json"
                    >
                    </v-textarea> -->
                  <!-- {{ data[getIndex].json }} -->
                  <!-- </highlight-code> -->
                </v-layout>
              </v-flex>
              <!-- <v-flex xs12>
                <v-checkbox
                  v-model="data[getIndex].public"
                  label="Сохранить шаблон"
                ></v-checkbox>
              </v-flex> -->
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
                  
                  