<template>
  <v-expansion-panel
    v-model="expandPanel"
    expand
    class="elevation-0 file-expansion-panel mb-2"
  >
    <v-expansion-panel-content>
      <template v-slot:header>
        <v-layout
          class="ma-0"
          align-center
        >
          <div class="body-2 text-uppercase mr-1">
            {{ $_.get(fileField, 'name') }}
          </div>

          <upload-btn
            class="d-none"
            :multiple="$_.get(fileField, 'props.object.multiple', false)"
            @file-update="updateAttachmentsHelper"
            :ref="'file-' + $_.get(fileField, 'id')"
          >
          </upload-btn>
          <v-btn
            icon
            class="pa-0 primary--text"
            :loading="loading"
            :disabled="loading"
            v-if="canAddFiles"
            @click="uploadBtnAction($_.get(fileField, 'id'))"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
      </template>
      <v-list
        two-line
        dense
        class="py-0"
      >
        <v-list-tile
          v-for="(file, index) in fileItems"
          :key="index"
          avatar
        >
          <v-list-tile-avatar>
            <v-icon class="primary white--text">assignment</v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              <a
                :href="$Helper.getDownloadLink(file.storageName)"
                target="_blank"
              >{{ file.originalName }}</a>
            </v-list-tile-title>

            <v-list-tile-sub-title>
              <v-layout
                class="ma-0"
                align-center
              >
                <span
                  class="pr-2"
                  v-if="$_.get(file, 'user.fio')"
                >
                  <v-layout
                    align-center
                    justify-center
                    row
                    fill-height
                    class="ma-0"
                  >
                    <v-icon
                      class="mr-1"
                      size="16"
                    >person</v-icon>
                    <span>{{ $_.get(file, 'user.fio') }}</span>
                  </v-layout>
                </span>

                <span
                  class="pr-2"
                  v-if="$_.get(file, 'date')"
                >
                  <v-layout
                    align-center
                    justify-center
                    row
                    fill-height
                    class="ma-0"
                  >
                    <v-icon
                      class="mr-1"
                      size="16"
                    >today</v-icon>
                    <span>{{ $Helper.formatDate($_.get(file, 'date'), 'DD.MM.YYYY HH:mm') }}</span>
                  </v-layout>
                </span>

                <span>
                  <span
                    class="link"
                    @click="deleteItem(file)"
                    v-if="$_.get(file, 'access.delete')"
                  >
                    удалить
                  </span>
                </span>
              </v-layout>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div
        class="grey--text"
        v-if="!$_.get(fileItems, 'length')"
      >Нет файлов</div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script src="./index.ts" lang="ts"></script>
