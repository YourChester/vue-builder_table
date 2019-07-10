<template>
  <v-card>
    <v-dialog
      v-model="openDialog"
      lazy
      persistent
      fullscreen
      @keydown.esc="cancelDialog"
    >
      <v-card>
        <v-toolbar
          card
          color="primary"
          dark
          fixed
          app
        >
          <v-toolbar-title>История</v-toolbar-title>
          <v-layout>
            <v-spacer></v-spacer>
            <v-btn
              flat
              icon
              @click="cancelDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-layout>
        </v-toolbar>
        <v-content>
          <v-container grid-list-md>
            <v-layout
              row
              wrap
            >
              <v-flex v-show="formattedHistoryData.length">
                <v-timeline
                  dense
                  clipped
                >
                  <v-timeline-item
                    v-for="item in formattedHistoryData"
                    :key="item.data"
                    small
                    right
                  >
                    <template v-slot:icon>
                      <v-avatar
                        v-if="item.user.avatar"
                        color="white"
                      >
                        <img
                          size="30px"
                          v-if="item.user.avatar.storageName"
                          :src="item.user.avatar.storageName"
                        >
                        <v-icon
                          v-else
                          size="50px"
                        >account_circle</v-icon>
                      </v-avatar>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-title class="pb-0">
                        <v-layout
                          align-end
                          justify-end
                        >
                          <v-flex
                            xs7
                            class="headline"
                          > {{ item.user.fio }} </v-flex>
                          <v-flex
                            xs5
                            text-xs-right
                          >
                            <v-icon size="18px">calendar_today
                            </v-icon>
                            {{ item.date }}
                          </v-flex>
                        </v-layout>
                      </v-card-title>
                      <v-card-text>
                        <v-layout
                          align-end
                          justify-end
                        >
                          <v-flex
                            xs12
                            v-if='!item.cardCreate'
                          >
                            <ul type="disc">
                              <li
                                v-for="(field,index) in item.fields"
                                :key="index"
                              >
                                <div>Поле <span class="font-weight-bold">"{{ field.name }}"</span> было изменено {{ checkForBlankValue(field.oldValue) }} на {{ formatForFieldData(field.newValue) }} </div>
                              </li>
                            </ul>
                          </v-flex>
                          <v-flex
                            xs12
                            v-if='item.cardCreate'
                          >
                            <ul type="disc">
                              <li
                                v-for="(field,index) in item.fields"
                                :key="index"
                              >
                                <div>Поле <span class="font-weight-bold">"{{ field.name }}"</span> &ndash; {{ formatForFieldData(field.newValue) }} </div>
                              </li>
                            </ul>
                          </v-flex>
                        </v-layout>

                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-flex>

              <v-card-text class="headline">
                <infinite-loading
                  spinner="spiral"
                  @infinite="infiniteHandler"
                  :identifier="infiniteId"
                >
                  <div slot="no-more"></div>
                  <div slot="no-results">
                    <template v-if="!formattedHistoryData.length">
                      <v-icon
                        size="50px"
                        color="grey"
                        class="mb-2"
                      >history</v-icon>
                      <div class="grey--text text-uppercase title">Истории нет</div>
                    </template>
                  </div>
                </infinite-loading>
              </v-card-text>
            </v-layout>
          </v-container>
        </v-content>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script src="./index.ts" lang="ts"></script>
                  
                  