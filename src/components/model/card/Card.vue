<template>
  <div class="card-model-wrapper">

    <v-layout
      class="primary white--text pa-2"
      align-center
    >
      <v-btn
        icon
        class="my-0 ml-0 mr-2"
        @click="openView()"
      >
        <v-icon color="white">arrow_back</v-icon>
      </v-btn>

      <div class="title">
        <span
          v-if="title"
          class="mr-3"
        >{{ title }}</span>
        <span v-if="objectId">#{{ objectId }}</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        icon
        class="mx-2 my-0"
        v-if="canDeleteObject && objectId"
        @click="deleteObject()"
      >
        <v-icon color="white">delete</v-icon>
      </v-btn>

      <v-btn
        icon
        class="ma-0"
        v-if="objectId"
        @click="openHistory()"
      >
        <v-icon color="white">history</v-icon>
      </v-btn>
    </v-layout>

    <ConfirmDialog
      :title="'Удалить данный элемент?'"
      :activator="showDeleteDialog"
      @success-callback="deleteCallback()"
      @close-callback="changeDeleteDialog(false)"
      @toogle-state-callback="changeDeleteDialog(!showDeleteDialog)"
    >
    </ConfirmDialog>

    <HistoryDialog
      :getData="objectId"
      :dialog="historyDialog"
      @cancelDialog="closeHistory()"
    ></HistoryDialog>

    <div
      class="pa-3"
      v-if="error"
    >
      <v-alert
        :value="error"
        type="error"
        class="ma-0"
        outline
      >
        {{ error }}
      </v-alert>
    </div>

    <div
      v-if="preloader"
      class="px-3 py-4 mt-1"
    >
      <ContentLoader
        :height="84"
        :width="600"
        :speed="1"
        primaryColor="#e0e0e0"
        secondaryColor="#ededed"
      >
        <rect
          x="0"
          y="0"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="153"
          y="0"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="306"
          y="0"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="459"
          y="0"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="0"
          y="20"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="153"
          y="20"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="306"
          y="20"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="459"
          y="20"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />

        <rect
          x="0"
          y="40"
          rx="4"
          ry="4"
          width="293"
          height="4"
        />
        <rect
          x="306"
          y="40"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="459"
          y="40"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />

        <rect
          x="0"
          y="60"
          rx="4"
          ry="4"
          width="293"
          height="4"
        />
        <rect
          x="306"
          y="60"
          rx="4"
          ry="4"
          width="293"
          height="4"
        />

        <rect
          x="0"
          y="80"
          rx="4"
          ry="4"
          width="293"
          height="4"
        />
        <rect
          x="306"
          y="80"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
        <rect
          x="459"
          y="80"
          rx="4"
          ry="4"
          width="140"
          height="4"
        />
      </ContentLoader>
    </div>

    <v-form
      ref="form"
      v-model="isFormValid"
      @submit.prevent=""
      v-if="!$_.isEmpty(grid) && !preloader"
    >
      <v-container
        grid-list-md
        fluid
        class="pa-3"
      >
        <v-layout
          raw
          wrap
          v-for="(row, i) in grid"
          :key="i"
        >
          <v-flex
            v-for="(item, j) in row"
            :key="j"
            v-if="$_.get(item, 'i.view', true)"
            v-bind="{ [`md${$_.get(item, 'width')}`]: true, [`offset-md${$_.get(item, 'offsetX')}`]: true }"
          >
            <template v-if="$_.get(item, 'i.type') === 'STRING' && $_.get(item, 'i.props.type') === 'short'">
              <v-text-field
                :label="$_.get(item, 'i.name')"
                v-model="item.i.value"
                :readonly="$_.get(item, 'i.readonly', false)"
                :clearable="!$_.get(item, 'i.readonly', false)"
                :required="$_.get(item, 'i.props.required', false)"
                :rules="getFormFieldRules($_.get(item, 'i.props'))"
              >
              </v-text-field>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'STRING' && $_.get(item, 'i.props.type') === 'long'">
              <v-textarea
                :label="$_.get(item, 'i.name')"
                v-model="item.i.value"
                :readonly="$_.get(item, 'i.readonly', false)"
                :clearable="!$_.get(item, 'i.readonly', false)"
                :required="$_.get(item, 'i.props.required', false)"
                :rules="getFormFieldRules($_.get(item, 'i.props'))"
                rows="3"
              >
              </v-textarea>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'OBJECT' && ($_.get(item, 'i.props.type') === 'select' || $_.get(item, 'i.props.type') === 'user') || $_.get(item, 'i.props.type') === 'group'">
              <v-select
                :label="$_.get(item, 'i.name')"
                :items="$_.get(objects, `${$_.get(item, 'i.id')}.data`, [])"
                item-value="id"
                :item-text="getSelectTextField.bind(null, item.i)"
                v-model="item.i.value"
                :readonly="$_.get(item, 'i.readonly', false)"
                :multiple="$_.get(item, 'i.props.object.multiple', false)"
                :clearable="!$_.get(item, 'i.readonly', false)"
                :required="$_.get(item, 'i.props.required', false)"
                :rules="getFormFieldRules($_.get(item, 'i.props'))"
                no-data-text="Нет данных"
                :chips="$_.get(item, 'i.props.type') === 'user'"
                :deletable-chips="$_.get(item, 'i.props.type') === 'user'"
                :small-chips="$_.get(item, 'i.props.type') === 'user'"
              >
                <template
                  v-if="$_.get(item, 'i.props.type') === 'user'"
                  v-slot:selection="data"
                >
                  <v-chip
                    :selected="data.selected"
                    :close="$_.get(item, 'i.props.object.multiple') && !$_.get(item, 'i.readonly', false)"
                    class="chip--select-multi"
                    small
                    @input="item.i.value = $_.remove(item.i.value, id => data.item.id !== id)"
                  >
                    <v-avatar>
                      <v-img
                        v-if="$_.get(data, 'item.avatar.storageName')"
                        :src="$Helper.getDownloadLink($_.get(data, 'item.avatar.storageName'))"
                      />
                      <v-icon
                        v-else
                        class="grey white--text"
                      >
                        person
                      </v-icon>
                    </v-avatar>

                    {{ getSelectTextField(item.i, data.item) }}
                  </v-chip>
                </template>
                <template
                  v-if="$_.get(item, 'i.props.type') === 'user'"
                  v-slot:item="data"
                >
                  <v-list-tile-avatar>
                    <v-img
                      v-if="$_.get(data, 'item.avatar.storageName')"
                      :src="$Helper.getDownloadLink($_.get(data, 'item.avatar.storageName'))"
                    />
                    <v-icon
                      v-else
                      class="grey white--text"
                    >
                      person
                    </v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ getSelectTextField(item.i, data.item) }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </v-select>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'OBJECT' && $_.get(item, 'i.props.type') === 'autocomplete'">
              <v-autocomplete
                :label="$_.get(item, 'i.name')"
                :items="$_.get(objects, `${$_.get(item, 'i.id')}.data`, [])"
                item-value="id"
                :item-text="getSelectTextField.bind(null, item.i)"
                v-model="item.i.value"
                :readonly="$_.get(item, 'i.readonly', false)"
                :multiple="$_.get(item, 'i.props.object.multiple', false)"
                :clearable="!$_.get(item, 'i.readonly', false)"
                :required="$_.get(item, 'i.props.required', false)"
                :rules="getFormFieldRules($_.get(item, 'i.props'))"
                @click:clear="item.i.value = $_.get(item, 'i.props.object.multiple') ? [] : ''"
                no-data-text="Нет данных"
              >
              </v-autocomplete>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'DATE'">
              <v-menu
                :disabled="$_.get(item, 'i.readonly', false)"
                :close-on-content-click='false'
                transition="scale-transition"
                lazy
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="$_.get(dateFormatted, $_.get(item, 'i.id'))"
                    :label="$_.get(item, 'i.name')"
                    prepend-inner-icon="event"
                    readonly
                    v-on="on"
                    :clearable="!$_.get(item, 'i.readonly', false)"
                    @click:clear="dateForDatepicket[$_.get(item, 'i.id')] = ''"
                    :required="$_.get(item, 'i.props.required', false)"
                    :rules="getFormFieldRules($_.get(item, 'i.props'))"
                  >
                  </v-text-field>
                </template>

                <v-date-picker
                  v-model="dateForDatepicket[$_.get(item, 'i.id')]"
                  @change="dateFormatUpdate($_.get(item, 'i.id'), dateForDatepicket[$_.get(item, 'i.id')])"
                  @input="datePickers[$_.get(item, 'i.key')] = false"
                  locale="ru"
                  :readonly="$_.get(item, 'i.readonly', false)"
                ></v-date-picker>
              </v-menu>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'HISTORY' && objectId">
              <UserActions
                :get-data="item.i.value"
                :name-of-field="item.i.name"
              ></UserActions>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'OBJECT' && $_.get(item, 'i.props.type') === 'file'">
              <files
                :object-id="objectId"
                :file-field="$_.get(item, 'i', null)"
                :card-access="cardAccess"
                @change-value="val => item.i.value = val"
                @get-new-rules="getRulesForFiles($_.get(item, 'i', null))"
              ></files>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'OBJECT' && $_.get(item, 'i.props.type') === 'comments' && objectId">
              <comments
                :object-id="objectId"
                :comment-field="$_.get(item, 'i', null)"
                :card-access="cardAccess"
              ></comments>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'OBJECT' && $_.get(item, 'i.props.type') === 'chat' && objectId">
              <chats
                :object-id="objectId"
                :reference="$_.get(item, 'i.props.object.reference')"
                :idChats="$_.get(item, 'i.value', null)"
                :comment-field="$_.get(item, 'i', null)"
                :card-access="cardAccess"
                @update-rules-for-card="updateRulesCard"
              ></chats>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'CUSTOM_FIELD' && $_.get(item, 'i.props.type') === 'button'">
              <template v-if="$_.get(item, 'i.props.action') === 'save_form'">
                <v-btn
                  color="primary"
                  class="ma-0"
                  @click="successAction()"
                  :loading="loading"
                  :disabled="loading"
                  v-if="canSaveObject"
                >
                  {{ $_.get(item, 'i.props.value', 'Действие') }}
                </v-btn>
              </template>
            </template>

            <template v-else-if="$_.get(item, 'i.type') === 'CUSTOM_FIELD' && $_.get(item, 'i.props.type') === 'card_info'">
              <v-layout
                class="ma-0"
                align-center
                justify-start
              >
                <field-view
                  v-if="!$_.isEmpty(objectAuthor)"
                  class="mr-5"
                  :avatar="$_.get(objectAuthor, 'avatar')"
                  :value="$_.get(objectAuthor, 'fio')"
                  icon="account_circle"
                  title="Автор"
                ></field-view>

                <field-view
                  v-if="objectDateCreate"
                  class="mr-5"
                  title="Создано"
                  :value="objectDateCreate"
                ></field-view>

                <field-view
                  v-if="objectDateEdit"
                  title="Обновлено"
                  :value="objectDateEdit"
                ></field-view>
              </v-layout>
            </template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>
