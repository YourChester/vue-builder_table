<template>
  <div class="border">
    <v-layout>
      <v-flex class="pa-2">

        <v-layout
          align-center
          justify-space-between
          row
          class="px-2"
          :class="$_.get(cardAccess.add.fields, accessKey, false)
                && $_.get(cardAccess.edit.fields, accessKey, false) ? '' : 'pt-3'"
        >
          <div class="body-2 text-uppercase ml-2">чаты</div>
          <div>
            <v-btn
              v-if="$_.get(cardAccess.add.fields, accessKey, false)
                && $_.get(cardAccess.edit.fields, accessKey, false)"
              flat
              icon
              color="primary"
              small
              @click="openChengeDialog('add')"
            >
              <v-icon>
                add
              </v-icon>
            </v-btn>
          </div>
        </v-layout>

        <v-list>
          <template v-if="$_.get(chatList, 'length', 0)">
            <template v-for="(i, index) in chatList">
              <v-list-tile
                class="button pa-0"
                v-if="$_.get(cardAccess.view.values[accessKey], i.id, false)"
                :key="i.id"
                :class="curentChat(i.id) ? 'active' : ''"
                :dark="curentChat(i.id)"
                @click="openChat(i.id, $event)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{i.name}}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action v-if="$_.get(cardAccess.edit.values[accessKey], i.id, false) || $_.get(cardAccess.delete.values[accessKey], i.id, false)">
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        flat
                        icon
                        small
                        v-on="on"
                        id="icon"
                      >
                        <v-icon>
                          more_vert
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile
                        v-if="$_.get(cardAccess.edit.values[accessKey], i.id, false)"
                        @click="openChengeDialog('edit', i.id)"
                      >
                        <v-list-tile-title class="button">Изменить</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile
                        v-if="$_.get(cardAccess.delete.values[accessKey], i.id, false)"
                        @click="startDeleteChat(i.id, index)"
                      >
                        <v-list-tile-title class="button">Удалить</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </template>
          <v-list-tile v-else>

            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout
                  align-center
                  column
                  class="grey--text"
                >
                  <div>Чатов нет</div>
                </v-layout>
              </v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="openDialog"
      max-width="500"
      @keydown.ctrl.enter="saveData"
      @keydown.esc="closeDialog"
      persistent
    >
      <v-card flat>
        <v-flex class="headline pa-3">Чат</v-flex>

        <v-divider></v-divider>

        <v-card-text class="pb-0 mb-0 pt-0 mt-3">
          <v-form
            @submit.prevent="saveData()"
            ref="form"
          >
            <v-alert
              :value="errorMsg"
              type="error"
              class="mb-3"
              outline
            >
              {{ errorMsg }}
            </v-alert>

            <v-text-field
              label="Название"
              type="text"
              v-model="form[nameKey]"
              class="ma-0 mb-2"
              required
              :rules="[rules.required]"
              hide-details
            >
            </v-text-field>
          </v-form>
        </v-card-text>

        <div class="members-list pa-3 mt-0">
          <div class="members-list">
            <v-card
              flat
              class="fill-height"
            >
              <common-users
                :selected-items="selectedForUsers"
                :creator="creatorForUsers"
                @add-item="addItem"
                @remove-item="removeItem"
              >
              </common-users>
            </v-card>
          </div>
        </div>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>

          <v-btn
            flat
            color="primary"
            @click="closeDialog"
          >Отменить</v-btn>
          <v-btn
            color="primary"
            @click="saveData"
            :loading="loading"
            :disabled="loading"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ConfirmDialog
      :title="'Удалить чат?'"
      :activator="removeDialogActive"
      @success-callback="deleteChat()"
      @close-callback="changeDeleteDialogState(false)"
      @toogle-state-callback="changeDeleteDialogState(!removeDialogActive)"
    >
    </ConfirmDialog>

  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss"></style>
