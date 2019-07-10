<template>
  <v-menu
    transition="slide-y-transition"
    :nudge-width="300"
    :nudge-left="300"
    :nudge-top="-6"
    :close-on-content-click="false"
    offset-y
    lazy
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        class="my-0 ml-2 mr-0"
        v-on="on"
      >
        <v-badge
          rigth
          overlap
          color="red"
          v-model="notificationCount"
        >
          <template v-slot:badge>
            <span>{{ notificationCount }}</span>
          </template>
          <v-icon
            class="px-2"
            color="white"
          >notifications_none</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card width="340">
      <div class="headline pa-3">Уведомления</div>

      <v-list
        v-if="$_.get(notificationList, 'length')"
        class="notification-content px-0 pt-0 pb-2"
      >
        <v-list-tile
          v-for="(item, index) in notificationList"
          :key="index"
          avatar
          class="clickable"
        >
          <v-list-tile-avatar color="primary">
            <v-icon
              size="16"
              color="white"
            >
              notifications_active
            </v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ $_.get(item, 'text') }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ $Helper.formatDate($_.get(item, 'dateCreate'), 'DD.MM.YYYY HH:mm') }}
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              icon
              ripple
              small
              @click="deleteNotification($_.get(item, 'id'))"
              :loading="$_.get(loading, $_.get(item, 'id'))"
              :disabled="$_.get(loading, $_.get(item, 'id'))"
            >
              <v-icon
                size="20"
                color="grey darken-1"
              >close</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-card-title v-if="!$_.get(notificationList, 'length')">
        <v-layout
          align-center
          justify-center
          column
          fill-height
          class="grey--text pa-2"
        >
          <v-icon class="mb-2">notifications_off</v-icon>
          <div>Нет уведомлений</div>
        </v-layout>
      </v-card-title>
    </v-card>
  </v-menu>
</template>
<script src="./index.ts" lang="ts"></script>