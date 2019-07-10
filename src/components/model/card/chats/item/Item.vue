<template>
  <div class="comments py-2 px-3">
    <div
      v-if="objectId"
      class="mb-3"
    >
      <v-layout
        align-center
        class="ma-0 pb-1"
      >
        <div class="text-uppercase body-2 py-2">
          Участники
        </div>

        <v-menu
          v-if="canEditUsers"
          v-model="menu"
          :close-on-content-click="false"
          :max-width="500"
          :min-width="500"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-btn
              flat
              icon
              color="primary"
              class="my-0 mx-1"
              v-on="on"
              @click="loadUsers()"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>

          <v-card class="add-members-menu">
            <v-card-text>
              <common-users
                :creator="creator"
                :selected-items="users"
                @add-item="addItem"
                @remove-item="removeItem"
              >
              </common-users>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-layout>

      <div>
        <v-chip
          small
          class="ml-0 mr-2"
          v-for="(item, index) in users"
          :key="index"
          :close="canEditUsers && $_.get(item, 'id') !== $_.get(creator, 'id')"
          @input="removeItem(item)"
        >
          <v-avatar>
            <v-img
              v-if="$_.get(item, 'avatar.storageName', false)"
              :src="$Helper.getDownloadLink(item.avatar.storageName)"
            />
            <v-icon
              v-else
              class="grey lighten-1 white--text"
            >
              person
            </v-icon>
          </v-avatar>
          {{ $_.get(item, 'fio', '') }}
        </v-chip>
      </div>
    </div>

    <v-alert
      :value="error"
      type="error"
      class="my-3"
      outline
    >
      {{ error }}
    </v-alert>

    <div
      class="maxHeight"
      id="para1"
    >
      <infinite-loading
        spinner="spiral"
        @infinite="infiniteHandler"
        :identifier="infiniteId"
        direction="top"
      >
        <div slot="no-more"></div>
        <div slot="no-results">
          <v-layout
            v-if="!$_.get(items, 'length') && objectId"
            align-center
            justify-center
            fill-height
            column
            class="pa-3 ma-0 grey--text"
          >
            <v-icon color="grey">chat</v-icon>
            <div>Сообщений нет</div>
          </v-layout>
        </div>
      </infinite-loading>

      <v-layout
        v-if="!objectId"
        align-center
        justify-center
        fill-height
        column
        class="pa-3 ma-0 grey--text"
      >
        <v-icon color="grey">chat</v-icon>
        <div>Выберите чат</div>
      </v-layout>

      <v-layout
        row
        justify-center
        class="mx-0 mt-0 mb-3"
        v-for="(item, index) in items"
        :key="index"
      >
        <div class="mr-3">
          <v-avatar
            class="avatar-div"
            v-if="$_.get(item, 'user.avatar.storageName')"
            size="41"
          >
            <img
              :src="$_.get(item, 'user.avatar.storageName')"
              class="avatar-img"
            >
          </v-avatar>
          <div
            v-else
            :class="$Helper.getRandomColorClassArray($_.get(item, 'user.id'))"
            class="circle white--text"
          >
            {{ getShortName($_.get(item, 'user.fio')) }}
          </div>
        </div>

        <v-flex class="comment-border pa-0">
          <v-layout
            align-center
            justify-start
            class="ma-0 pa-2 comment-header grey--text text--darken-2"
          >
            <div class="header font-weight-medium">
              {{ $_.get(item, 'user.fio') }}
            </div>

            <v-layout
              align-center
              class="ma-0 caption"
            >
              <div v-if="$_.get(item, 'user.job')">
                <span class="pl-2 pr-1">
                  <v-icon size="16">person</v-icon>
                </span>
                <span>{{ $_.get(item, 'user.job') }}</span>
              </div>

              <div
                class="caption"
                v-if="$_.get(item, 'dateOpen')"
              >
                <span class="pl-2 pr-1">
                  <v-icon size="16">today</v-icon>
                </span>
                <span class="">{{ $Helper.formatDate($_.get(item, 'dateOpen'), 'DD.MM.YYYY HH:mm') }}</span>
                <span
                  class="ml-1"
                  v-if="$_.get(item, 'dateOpen') !== $_.get(item, 'dateEdit')"
                >(изменено)</span>
              </div>

              <div
                class="ml-2"
                v-if="$_.get(item, 'access.edit')"
              >
                <a
                  class="link grey--text text--darken-1"
                  @click="editComment(item)"
                >изменить</a>
                <span
                  v-if="$_.get(item, 'access.delete')"
                  class="ml-1"
                >-</span>
              </div>

              <div
                class="ml-1"
                v-if="$_.get(item, 'access.delete')"
              >
                <a
                  class="link grey--text text--darken-1"
                  @click="deleteComment(item)"
                >удалить</a>
              </div>
            </v-layout>
          </v-layout>

          <div
            class="comment-text body-2 pa-2 font-weight-regular"
            :class="$_.get(comment, 'id') === $_.get(item, 'id') ? ['blue', 'lighten-4'] : []"
            v-html="$_.get(item, fieldKeys.text)"
          ></div>

          <!--
          <v-layout
            align-center
            class="ma-0 pt-1"
            v-if="$_.get(item, 'attachment.id')"
          >
            <v-icon
              size="20"
              color="primary"
              class="mr-1"
            >assignment</v-icon>

            <a
              class="link primary--text caption"
              :href="$Helper.getDownloadLink($_.get(item, 'attachment.storageName'))"
              target="_blank"
            >
              {{ $_.get(item, 'attachment.originalName') }}
            </a>
          </v-layout>
          -->
        </v-flex>
      </v-layout>
    </div>

    <div
      @keydown.ctrl.enter="saveComment"
      class="my-3 comment-form"
      v-show="ruleForAddMessage"
    >
      <quill-editor
        class="quill-editor"
        v-model="comment.text"
        :options="config"
        id="add-comment-form"
      >
      </quill-editor>

      <!--
      <v-layout
        align-center
        class="ma-0 comment-form-file"
      >
        <upload-btn
          color="darken-3"
          class="py-0 px-2"
          labelClass="ma-0 px-1 grey--text text--darken-1"
          fixedWidth="50"
          title="Файл"
          icon
          :multiple="true"
          @file-update="updateCommentAttachment"
          ref="attachment"
        >
          <template slot="icon">
            <v-icon>attachment</v-icon>
          </template>
        </upload-btn>
      </v-layout>
      -->

      <div class="attachments">
        <v-layout
          align-center
          v-for="(attachment, index) in comment.attachments"
          :key="index"
          class="ma-0"
        >
          <v-flex md5>
            <v-icon
              small
              class="mr-2"
            >attachment</v-icon>
            <span>{{ attachment.name }}</span>
          </v-flex>
          <v-flex md-1>
            <v-btn
              small
              icon
              @click="comment.attachments.splice(index, 1)"
              class="ma-0"
            >
              <v-icon small>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </div>

      <v-layout
        align-center
        class="mx-0 mb-0 mt-2"
      >
        <v-btn
          color="primary"
          :disabled="!comment.text && !$_.get(comment.attachments, 'length') || loading"
          :loading="loading"
          class="ma-0"
          @click="saveComment($event)"
        >
          Отправить
        </v-btn>
        <v-btn
          flat
          class="ml-2"
          v-if="comment.id"
          @click="resetCommentForm()"
        >
          Отмена
        </v-btn>
      </v-layout>
    </div>

    <confirm-dialog
      :activator="removeDialogActive"
      title="Удалить комментарий"
      @success-callback="deleteCallback()"
      @close-callback="changeDeleteDialogState(false)"
      @toogle-state-callback="changeDeleteDialogState(!removeDialogActive)"
    >
    </confirm-dialog>
  </div>
</template>
<script src="./index.ts" lang="ts"></script>
<style src="./style.scss" lang="scss" scoped></style>
