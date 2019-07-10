<template>
  <div class="actions">
    <div class="subheading text-uppercase my-3">{{ nameOfField }}</div>
    <div class="userActions">
      <v-layout
        column
        wrap
      >
        <v-flex
          v-show="formattedHistoryData.length"
          class="pa-0 ma-0"
        >
          <v-flex
            v-for="(array, index) in formattedHistoryData"
            :key="index"
          >
            <v-list :class="{'mb-2': index !== $_.get(formattedHistoryData, 'length') - 1}">
              <template v-for="item in array">
                <v-list-tile
                  :key="item.newValue"
                  avatar
                  class="py-1"
                >
                  <v-list-tile-avatar>
                    <img
                      v-if="item.user.avatar.storageName"
                      :src="item.user.avatar.storageName"
                    >
                    <v-icon
                      v-else
                      size="50px"
                      color="grey"
                    >account_circle</v-icon>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.user.fio"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span>
                        <span class="dateText">{{ item.date }}</span>
                        <span class="mx-1">&mdash;</span>
                      </span>
                      <span>
                        <span
                          v-for="(field, i) in item.fields"
                          :key="field.name"
                        >
                          "{{ field.name }}" изменен на "{{ field.newValue }}"
                          <span v-if="i < item.fields.length - 1">,</span>
                        </span>
                      </span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <v-divider
              v-if="index < formattedHistoryData.length - 1"
              :key="index"
            ></v-divider>
          </v-flex>
        </v-flex>
        <v-flex
          v-if="!formattedHistoryData.length"
          text-xs-center
        >
          <v-card-text class="pa-0">
            <v-icon
              size="28px"
              color="grey"
              class="pt-2"
            >history</v-icon>
            <div class="grey--text pb-2">Нет данных</div>
          </v-card-text>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
                  
                  