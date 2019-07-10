<template>
  <v-toolbar
    color="blue darken-3"
    app
    fixed
  >
    <v-toolbar-side-icon
      class="white--text mr-3"
      @click.stop="storeState.sidenav.isActive = !storeState.sidenav.isActive"
    >
    </v-toolbar-side-icon>

    <router-link :to="{name:'main'}">
      <v-img
        width="50"
        max-width="50"
        :src="require('@/assets/img/logo.png')"
      ></v-img>
    </router-link>

    <v-toolbar-title
      class="my-0 mx-3 white--text font-weight-regular main-title"
      :to="{name: 'main'}"
    >
      {{ $_.get(env, 'VUE_APP_NAME') }}
    </v-toolbar-title>

    <slot name="context"></slot>

    <v-spacer v-if="!$slots['context']"></v-spacer>

    <notifications></notifications>

    <template v-slot:extension>
      <slot name="extension"></slot>
    </template>

  </v-toolbar>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="scss" src="./style.scss" scoped></style>

