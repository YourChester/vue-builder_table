<template>
  <div fill-height>
    <div class="subheading text-uppercase font-weight-regular">
      {{ countMembers }}
    </div>

    <v-flex>
      <div
        class="selected-items mt-2 mb-2"
        v-if="$_.get(list, 'length')"
      >
        <v-chip
          v-for="(item, index) in selectedItems"
          :key="index"
          :close="$_.get(item, 'id') !== $_.get(creator, 'id')"
          @input="removeItem(item)"
        >
          <v-avatar>
            <v-img
              v-if="$_.get(item, 'avatar.storageName')"
              :src="$Helper.getDownloadLink($_.get(item, 'avatar.storageName'))"
            />
            <v-icon
              v-else
              class="grey lighten-1 white--text"
            >
              person
            </v-icon>
          </v-avatar>
          <span class="text-truncate">
            {{ $_.get(item, 'fio') }}
          </span>
        </v-chip>
      </div>
    </v-flex>

    <v-text-field
      solo
      flat
      label="Поиск"
      class="mb-2"
      v-model="params.search"
      clearable
      hide-details
      background-color="#f5f5f5"
      height="38"
      color="blue"
      @keydown.enter="search()"
      @click:clear="resetSearch()"
    ></v-text-field>

    <v-list
      subheader
      two-line
      class="user-list"
    >
      <v-list-tile
        v-for="(item, index) in list"
        :key="index"
        @click="itemInteraction(item)"
        avatar
      >
        <v-list-tile-avatar>
          <v-img
            v-if="$_.get(item, 'avatar.storageName')"
            :src="$Helper.getDownloadLink($_.get(item, 'avatar.storageName'))"
          />
          <v-icon
            v-else
            class="grey lighten-1 white--text"
          >
            person
          </v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ $_.get(item, 'fio') }}</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-icon
            v-if="$_.find(selectedItems, el => $_.get(el, 'id') === $_.get(item, 'id'))"
            color="teal"
          >check_circle</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteId"
      >
        <div slot="no-more">
          <v-layout
            align-center
            justify-center
            class="py-4 px-3 grey--text"
          >
            <v-icon
              class="mr-2"
              color="grey"
            >done_all</v-icon>
            <span class="text-uppercase">Все данные загружены</span>
          </v-layout>
        </div>
        <div slot="no-results"></div>
      </infinite-loading>

      <v-layout
        align-center
        justify-center
        class="py-4 px-3 grey--text"
        v-if="!$_.get(list, 'length')"
      >
        <v-icon
          class="mr-2"
          color="grey"
        >cloud_off</v-icon>
        <span class="text-uppercase">Ничего не найдено</span>
      </v-layout>
    </v-list>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss" scoped></style>
