<template>
  <div>
    <v-navigation-drawer
      v-model="storeState.sidenav.isActive"
      temporary
      app
    >
      <header
        class="modal-header primary"
        id="modalTitle"
      >
        <v-flex>
          <div class="avatar">
            <v-avatar
              size="56"
              v-if="$_.get(storeUser, 'avatar.storageName', false)"
            >
              <v-img
                :src="$Helper.getDownloadLink(storeUser.avatar.storageName)"
                alt="avatar"
              />
            </v-avatar>
            <v-icon
              v-else
              class="white--text"
              size="56px"
            >account_circle</v-icon>
          </div>
          <div>
            <div class="font-weight-medium">
              {{ $_.get(storeUser, 'fio', 'Пользователь') }}
            </div>
            <div
              class="font-weight-medium"
              v-if="$_.get(storeUser, 'organization.name')"
            >
              {{ $_.get(storeUser, 'organization.name') }}
            </div>

            <v-layout
              align-center
              justify-space-between
              row
            >
              <div
                class="font-weight-regular"
                v-if="$_.get(storeUser, 'phone')"
              >
                {{ $_.get(storeUser, 'phone') }}
              </div>

              <v-menu
                bottom
                left
                class="user-menu"
              >
                <v-btn
                  slot="activator"
                  dark
                  icon
                >
                  <v-icon>more_vert</v-icon>
                </v-btn>

                <v-list>
                  <v-list-tile @click="logout()">
                    <v-list-tile-title>Выйти</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-layout>
          </div>
        </v-flex>
      </header>
      <section
        class="modal-body pt-2"
        id="modalDescription"
      >
        <slot name="body">
          <v-list>
            <v-list-group v-if="$_.get(menu.views, 'length')">
              <v-list-tile slot="activator">
                <v-list-tile-avatar>
                  <v-icon size="18px">list</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title-text">Реестры</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                v-for="(item, index) in menu.views"
                :key="index"
                @click="openLink({name:'modelCardList', params: {listId: $_.get(item, 'id')}})"
              >
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title-text">
                    {{ $_.get(item, 'name', 'Реестр') }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>

            <v-list-group v-if="menu.configuration.visible">
              <v-list-tile slot="activator">
                <v-list-tile-avatar>
                  <v-icon size="18px">settings</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title-text">Конфигурация</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                v-for="(item,index) of menu.configuration.items"
                :key="index"
                @click="openLink({ name: $_.get(item, 'route') })"
              >
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title-text">{{ $_.get(item, 'name') }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>

          </v-list>
        </slot>
      </section>
    </v-navigation-drawer>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style lang="scss" src="./style.scss" scoped></style>
