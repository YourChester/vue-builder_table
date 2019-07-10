<template>
  <div>
    <v-layout
      align-center
      class="ma-0 pb-2 grey--text text--darken-1"
    >
      <v-avatar
        size="36"
        class="mr-3"
        v-if="avatar || icon"
      >
        <v-img
          v-if="$_.get(avatar, 'storageName')"
          :src="$Helper.getDownloadLink($_.get(avatar, 'storageName'))"
        />
        <v-icon
          v-else-if="icon"
          size="40"
          class="grey--text"
        >
          {{ icon }}
        </v-icon>
      </v-avatar>

      <div>
        <div
          v-if="title"
          class="caption font-weight-bold text-uppercase"
        >
          {{ title }}
        </div>
        <div v-if="value">{{ value }}</div>
      </div>
    </v-layout>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
