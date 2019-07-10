<template>
  <v-dialog
    v-model="isActiveDialog"
    width="1100"
    lazy
    persistent
  >
    <v-card class="my-0 pa-3">
      <div class="display-1 mb-3">
        Триггер
      </div>

      <v-alert
        :value="error"
        type="error"
        class="mx-0 mt-0 mb-3"
        outline
      >
        {{ error }}
      </v-alert>

      <v-form
        ref="form"
        v-model="isFormValid"
        @submit.prevent=""
      >
        <v-text-field
          v-model="form.name"
          label="Название"
          clearable
        ></v-text-field>

        <v-select
          label="Событие"
          :items="list.events"
          v-model="form.event"
          item-text="text"
          item-value="value"
          no-data-text="Нет данных"
          class="mb-3"
          hide-details
          clearable
        >
        </v-select>

        <v-select
          label="Поле"
          item-text="name"
          item-value="id"
          :items="list.fields"
          v-model="form.objectField"
          no-data-text="Нет данных"
          class="mb-3"
          hide-details
          clearable
        >
        </v-select>

        <v-select
          label="Поле пользователей"
          item-text="name"
          item-value="key"
          :items="userFields"
          v-model="form.properties.notification.usersField"
          no-data-text="Нет данных"
          class="mb-3"
          hide-details
          clearable
        >
        </v-select>

        <v-select
          label="Действие"
          item-text="text"
          item-value="value"
          :items="list.types"
          v-model="form.type"
          no-data-text="Нет данных"
          class="mb-3"
          hide-details
          clearable
        >
        </v-select>

        <v-text-field
          v-model="form.properties.notification.text"
          label="Текст уведомления"
          hide-details
        ></v-text-field>

        <div class="mt-4 mb-2">
          <v-layout align-center>
            <div class="body-1">Правила</div>

            <v-btn
              icon
              class="my-0 ml-2 mr-0"
              @click="addRule()"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-layout>

          <div
            class="mt-1"
            v-if="!$_.get(form, 'rules.length')"
          >
            Нет правил
          </div>

          <v-layout
            v-for="(item,index) of form.rules"
            :key="index"
            class="mt-3"
            align-top
          >

            <v-select
              class="ma-0"
              label="Роли"
              item-text="name"
              item-value="id"
              multiple
              :items="list.roles"
              v-model="form.rules[index].roles"
              no-data-text="Нет данных"
              hide-details
              clearable
            >
            </v-select>

            <div class="mx-2">
              <div class="body-1">JSON</div>

              <editor
                v-model="form.rules[index].json"
                @init="editorInit"
                lang="json"
                theme="chrome"
                width="660"
                height="150"
              ></editor>
            </div>

            <v-spacer></v-spacer>

            <div>
              <v-btn
                @click="form.rules.splice(index, 1)"
                icon
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </div>

          </v-layout>
        </div>

      </v-form>

      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <v-btn
          flat
          class="my-0 mx-2"
          @click="cancelAction"
        >
          Отменить
        </v-btn>
        <v-btn
          class="ma-0"
          color="primary"
          @click="successAction"
          :loading="loading"
          :disabled="loading"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script src="./index.ts" lang="ts"></script>
