<template>
  <v-dialog
    width="800"
    lazy
    persistent
    v-model="isActivateDialog"
  >
    <v-card class="my-0 pa-3">

      <div class="display-1 mb-3">
        Модель данных
      </div>

      <v-alert
        :value="error"
        type="error"
        class="mb-3"
        outline
      >
        {{ error }}
      </v-alert>

      <v-text-field
        label="Название"
        v-model="form.name"
      ></v-text-field>

      <v-card-actions class="mt-2 pa-0">
        <v-spacer></v-spacer>

        <v-btn
          flat
          color="primary"
          @click="cancelAction()"
        >Отмена</v-btn>

        <v-btn
          color="primary"
          @click="successAction()"
          :loading="loading"
          :disabled="loading"
        >Сохранить</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>
<script src="./index.ts" lang="ts"></script>
