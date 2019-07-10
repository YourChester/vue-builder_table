<template>
  <v-snackbar
    v-model="storeState.snackbar.status"
    bottom
  >
    {{ storeState.snackbar.msg }}
  </v-snackbar>
</template>

<script src="./index.ts" lang="ts"></script>