<template>
  <div class="pa-4">
    <Toolbar>
      <template v-slot:context>
        <v-layout fluid>
          <template v-if="$_.find(filters[0], {'i': {key: 'search'}})">
            <v-layout fluid>
              <v-flex
                :key="$_.get(filters, '0[0].i.name')"
                v-bind="{ [`md${$_.find(filters[0], {'i': {key: 'search'}}).width}`]: true, [`offset-md${$_.find(filters[0], {'i': {key: 'search'}}).offsetX}`]: true }"
              >
                <v-text-field
                  flat
                  solo-inverted
                  dark
                  clearable
                  placeholder="Поиск"
                  color='white'
                  append-icon="search"
                  style="caret-color: black !important;"
                  class="hidden-sm-and-down search pr-2 pt-2"
                  v-model="search"
                  v-on:keyup.enter="onChangedSearch(search, 'search')"
                  @click:clear="onChangedSearch('', 'search')"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </template>
          <template v-if="$_.get(filters, '0.length') > 1">
            <template v-for="(i) in $_.get(filters, '0')">
              <v-flex
                :key="i.i.key"
                v-if="i.i.type === 'STRING'"
                v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
                class="pr-2 mt-2"
              >
                <v-text-field
                  flat
                  solo-inverted
                  dark
                  clearable
                  color='white'
                  class="hidden-sm-and-down search"
                  style="caret-color: black !important;"
                  v-model="data[i.i.key]"
                  @click:clear="data[i.i.key] = ''; getFilterValue(i.i.key, i.i.array)"
                  @change="getFilterValue(i.i.key, i.i.array)"
                >
                  <template
                    slot="label"
                    class="text"
                  >
                    <div>{{i.i.name}}</div>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex
                :key="i.i.key"
                v-if="$_.get(i, 'i.type') === 'OBJECT' && $_.get(i, 'i.props.type') === 'autocomplete'"
                v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
                class="pr-2 mt-2"
              >
                <v-autocomplete
                  :label="i.i.name"
                  :items="$_.get(objects, `${$_.get(i, 'i.id')}.data`, [])"
                  item-value="id"
                  :item-text="getSelectTextField.bind(null, i.i)"
                  v-model="data[i.i.key]"
                  @change="getFilterValue(i.i.key, i.i.array)"
                  no-data-text="Нет данных"
                  :menu-props="{ maxHeight: '400' }"
                  flat
                  hide-details
                  class="text-ellipsis"
                  persistent-hint
                  style="caret-color: black !important;"
                  append-icon="$vuetify.icons.dropdown"
                  clearable
                  dark
                  :multiple="$_.get(i, 'i.props.object.multiple')"
                  background-color="#3b7eca"
                  solo-inverted
                  :required="$_.get(i, 'i.props.required', false)"
                  @click:clear="data[i.i.key] = $_.get(i, 'i.props.object.multiple') ? [] : ''; getFilterValue(item.i.key, item.i.array)"
                >
                  <template
                    slot="append-item"
                    v-if="!$_.get(objects, `${$_.get(i, 'i.id')}.last`)"
                  >
                    <v-layout
                      align-center
                      justify-center
                      row
                      fill-height
                    >
                      <v-btn
                        :loading="loadingMoreLoad"
                        :disabled="loadingMoreLoad"
                        flat
                        color="primary"
                        @click="getMoreObjects($_.get(i, 'i.props.type'), $_.get(i, 'i.id'), $_.get(objects, `${$_.get(i, 'i.id')}.page`), $_.get(i, 'i.props.object.reference') ? $_.get(i, 'i.props.object.reference') : 0)"
                      >
                        Загрузить еще...
                      </v-btn>
                    </v-layout>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex
                :key="i.i.key"
                v-if="$_.get(i, 'i.type') === 'OBJECT' && ($_.get(i, 'i.props.type') === 'select' || $_.get(i, 'i.props.type') === 'user') || $_.get(i, 'i.props.type') === 'group'"
                v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
                class="pr-2 mt-2"
              >
                <v-select
                  :label="i.i.name"
                  :items="$_.get(objects, `${$_.get(i, 'i.id')}.data`, [])"
                  item-value="id"
                  :item-text="getSelectTextField.bind(null, i.i)"
                  v-model="data[i.i.key]"
                  @change="getFilterValue(i.i.key, i.i.array)"
                  no-data-text="Нет данных"
                  :menu-props="{ maxHeight: '400' }"
                  flat
                  hide-details
                  class="text-ellipsis"
                  persistent-hint
                  append-icon="$vuetify.icons.dropdown"
                  clearable
                  dark
                  :multiple="$_.get(i, 'i.props.object.multiple')"
                  background-color="#3b7eca"
                  solo-inverted
                >
                  <template slot="append-item">
                    <v-layout
                      align-center
                      justify-center
                      row
                      fill-height
                    >
                      <v-btn
                        flat
                        :loading="loadingMoreLoad"
                        :disabled="loadingMoreLoad"
                        color="primary"
                        @click="getMoreObjects($_.get(i, 'i.props.type'), $_.get(i, 'i.id'), $_.get(objects, `${$_.get(i, 'i.id')}.page`), $_.get(i, 'i.props.object.reference') ? $_.get(i, 'i.props.object.reference') : 0)"
                      >
                        Загрузить еще...
                      </v-btn>
                    </v-layout>
                  </template>
                </v-select>
              </v-flex>

              <!--
              <v-flex
                :key="item.i.key"
                v-if="item.i.type === 'DATE'"
                v-bind="{ [`md${$_.get(item, 'width')}`]: true, [`offset-md${$_.get(item, 'offsetX')}`]: true }"
                class="pr-2 mt-2"
              >
                <v-menu
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
                      clearable
                      @click:clear="data[item.i.key] = ''; getFilterValue(item.i.key, item.i.array)"
                      :menu-props="{ maxHeight: '400' }"
                      flat
                      hide-details
                      class="text-ellipsis"
                      persistent-hint
                      dark
                      multiple
                      background-color="#3b7eca"
                      solo-inverted
                    >
                    </v-text-field>
                  </template>

                  <v-date-picker
                    v-model="data[item.i.key]"
                    @change="dateFormatUpdate($_.get(item, 'i.id'), data[item.i.key]); getFilterValue(item.i.key, item.i.array)"
                    @input="datePickers[$_.get(item, 'i.key')] = false"
                    locale="ru"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              -->
            </template>
          </template>
        </v-layout>

        <v-spacer></v-spacer>
        <v-btn
          v-if="$_.has(filters, '1')"
          class="ma-0"
          @click="openFilters()"
          icon
        >
          <v-icon
            color="white"
            v-text="openFilter ? 'close' : 'filter_list'"
          ></v-icon>
        </v-btn>
      </template>

      <template
        v-slot:extension
        v-if="openFilter"
      >
        <v-layout fluid>
          <template v-for="(i) in $_.get(filters, '1')">
            <v-flex
              :key="i.i.key"
              v-if="i.i.type === 'STRING'"
              v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
              class="pr-2"
            >
              <v-text-field
                flat
                solo-inverted
                dark
                clearable
                :label="i.i.name"
                color='white'
                class="hidden-sm-and-down search"
                style="caret-color: black !important;"
                v-model="data[i.i.key]"
                @click:clear="data[i.i.key] = ''; getFilterValue(i.i.key, i.i.array)"
                @change="getFilterValue(i.i.key, i.i.array)"
              >
              </v-text-field>
            </v-flex>
            <v-flex
              :key="i.i.key"
              v-if="$_.get(i, 'i.type') === 'OBJECT' && $_.get(i, 'i.props.type') === 'autocomplete'"
              v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
              class="pr-2"
            >
              <v-autocomplete
                :label="i.i.name"
                :items="$_.get(objects, `${$_.get(i, 'i.id')}.data`, [])"
                item-value="id"
                :item-text="getSelectTextField.bind(null, i.i)"
                v-model="data[i.i.key]"
                @change="getFilterValue(i.i.key, i.i.array)"
                no-data-text="Нет данных"
                :menu-props="{ maxHeight: '400' }"
                flat
                hide-details
                class="text-ellipsis"
                persistent-hint
                append-icon="$vuetify.icons.dropdown"
                clearable
                dark
                :multiple="$_.get(i, 'i.props.object.multiple')"
                background-color="#3b7eca"
                solo-inverted
                :required="$_.get(i, 'i.props.required', false)"
                @click:clear="data[i.i.key] = $_.get(i, 'i.props.object.multiple') ? [] : ''; getFilterValue(i.i.key, i.i.array)"
              >
                <template
                  slot="append-item"
                  v-if="!$_.get(objects, `${$_.get(i, 'i.id')}.last`)"
                >
                  <v-layout
                    align-center
                    justify-center
                    row
                    fill-height
                  >
                    <v-btn
                      :loading="loadingMoreLoad"
                      :disabled="loadingMoreLoad"
                      flat
                      color="primary"
                      @click="getMoreObjects($_.get(i, 'i.props.type'), $_.get(i, 'i.id'), $_.get(objects, `${$_.get(i, 'i.id')}.page`), $_.get(i, 'i.props.object.reference') ? $_.get(i, 'i.props.object.reference') : 0)"
                    >
                      Загрузить еще...
                    </v-btn>
                  </v-layout>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex
              :key="i.i.key"
              v-if="$_.get(i, 'i.type') === 'OBJECT' && ($_.get(i, 'i.props.type') === 'select' || $_.get(i, 'i.props.type') === 'user') || $_.get(i, 'i.props.type') === 'group'"
              v-bind="{ [`md${$_.get(i, 'width')}`]: true, [`offset-md${$_.get(i, 'offsetX')}`]: true }"
              class="pr-2"
            >
              <v-select
                :label="i.i.name"
                :items="$_.get(objects, `${$_.get(i, 'i.id')}.data`, [])"
                item-value="id"
                :item-text="getSelectTextField.bind(null, i.i)"
                v-model="data[i.i.key]"
                @change="getFilterValue(i.i.key, i.i.array)"
                no-data-text="Нет данных"
                :menu-props="{ maxHeight: '400' }"
                flat
                hide-details
                class="text-ellipsis"
                persistent-hint
                append-icon="$vuetify.icons.dropdown"
                clearable
                dark
                :multiple="$_.get(i, 'i.props.object.multiple')"
                background-color="#3b7eca"
                solo-inverted
              >
                <template
                  v-if="$_.get(i, 'i.props.object.multiple')"
                  v-slot:selection="{ item, index }"
                >
                  {{$_.get(item, 'name')}}{{ data[i.i.key].length-1 !== index?', ':''}}
                </template>
                <template
                  slot="append-item"
                  v-if="!$_.get(objects, `${$_.get(i, 'i.id')}.last`)"
                >
                  <v-layout
                    align-center
                    justify-center
                    row
                    fill-height
                  >
                    <v-btn
                      :loading="loadingMoreLoad"
                      :disabled="loadingMoreLoad"
                      flat
                      color="primary"
                      @click="getMoreObjects($_.get(i, 'i.props.type'), $_.get(i, 'i.id'), $_.get(objects, `${$_.get(i, 'i.id')}.page`), $_.get(i, 'i.props.object.reference') ? $_.get(i, 'i.props.object.reference') : 0)"
                    >
                      Загрузить еще...
                    </v-btn>
                  </v-layout>
                </template>
              </v-select>
            </v-flex>

            <!--
            <v-flex
              :key="item.i.key"
              v-if="item.i.type === 'DATE'"
              v-bind="{ [`md${$_.get(item, 'width')}`]: true, [`offset-md${$_.get(item, 'offsetX')}`]: true }"
              class="pr-2"
            >
              <v-menu
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
                    clearable
                    @click:clear="data[item.i.key] = ''; getFilterValue(item.i.key, item.i.array)"
                    :menu-props="{ maxHeight: '400' }"
                    flat
                    hide-details
                    class="text-ellipsis"
                    persistent-hint
                    dark
                    multiple
                    background-color="#3b7eca"
                    solo-inverted
                  >
                  </v-text-field>
                </template>

                <v-date-picker
                  v-model="data[item.i.key]"
                  @change="dateFormatUpdate($_.get(item, 'i.id'), data[item.i.key]); getFilterValue(item.i.key, item.i.array)"
                  @input="datePickers[$_.get(item, 'i.key')] = false"
                  locale="ru"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            -->
          </template>
        </v-layout>
      </template>

    </Toolbar>

    <div class="display-1 mb-2">{{name}}</div>

    <v-layout
      align-center
      justify-center
      row
      fill-height
      class="mb-4"
      v-if="!preloader"
    >
      <v-flex
        xs6
        class="text-xs-left subheading text-uppercase"
        align-self-center
      >
        Всего: {{ totalElement }}
      </v-flex>
      <v-flex
        xs6
        class="text-xs-right"
      >
        <v-btn
          v-if="addSucces"
          @click="goToCardd()"
          flat
          outline
          class="ma-0"
        >
          <v-icon class="mr-2">
            add
          </v-icon>
          Добавить
        </v-btn>
      </v-flex>
    </v-layout>

    <v-alert
      :value="errorMsg"
      type="error"
      class="mb-3"
      outline
    >
      {{ errorMsg }}
    </v-alert>

    <v-layout
      align-center
      justify-center
      row
      fill-height
      class="pa-0"
    >
      <v-flex md12>
        <transition
          :name="'component-fade-in'"
          mode="out-in"
        >
          <v-data-table
            :headers="dataHeader"
            :items="items"
            :disable-initial-sort="true"
            hide-actions
            no-data-text="Нет данных"
            class="elevation-1"
            v-if="$_.get(items, 'length')"
          >
            <template
              v-if="!$_.isEmpty(items)"
              v-slot:items="{item, index}"
            >
              <tr class="registry-row">
                <template v-for="(header, num) in dataHeader">
                  <td
                    class="pa-2 pl-2 link"
                    :key="num"
                    v-if="header.type == 'STRING' && header.value === 'id'"
                    @click="openCard(item)"
                  >
                    <v-layout
                      align-center
                      justify-center
                      row
                      fill-height
                    >
                      <span
                        class="mr-2 have_change_main"
                        :title="$_.get(checkViewDate(item), 'title', '')"
                      >
                        <div
                          v-if="!$_.isEmpty(checkViewDate(item))"
                          :class="$_.get(checkViewDate(item), 'class', [])"
                        >
                        </div>
                      </span>
                      <span class="link">
                        {{ $_.get(item, header.value) }}
                      </span>
                    </v-layout>
                  </td>
                  <td
                    @click="openCard(item)"
                    class="pa-2 pl-4 link"
                    :key="num"
                    v-else-if="header.type == 'STRING'"
                  >
                    <span
                      class="link"
                      @click="openCard(item)"
                    >
                      {{ $_.get(item, header.value) }}
                    </span>
                  </td>
                  <td
                    class="pa-2 pl-4"
                    :key="num"
                    v-else-if="header.type == 'DATE'"
                  >
                    <span>
                      {{ getFormattedDate(item[header.value]) }}
                    </span>
                  </td>
                  <td
                    class="pa-2 pl-4"
                    :key="num"
                    v-else-if="header.type == 'OBJECT'"
                  >
                    <span>
                      {{ !$_.isEmpty($_.get(item, header.value)) ? item[header.value] : '' }}
                    </span>
                  </td>
                  <td
                    class="pa-2 pl-4"
                    :key="num"
                    v-else-if="header.type == 'FILE'"
                  >
                    <span>
                      <div
                        v-for="f in item[header.value]"
                        :key="f.id"
                        avatar
                      >
                        <a
                          class="text-sm-right"
                          :href="$Helper.getDownloadLink($_.get(item[header.value], '0.storageName'))"
                        >
                          {{f.originalName}}
                        </a>
                      </div>
                    </span>
                  </td>
                  <td
                    class="pa-2 pl-4"
                    :key="num"
                    v-else
                  >
                    <span>
                      {{ $_.get(item, header.value) }}
                    </span>
                  </td>
                </template>
              </tr>
            </template>
          </v-data-table>
        </transition>

        <infinite-loading
          @infinite="infiniteHandler"
          :identifier="infiniteId"
        >
          <div slot="spinner"></div>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>

        <div
          v-if="preloader"
          class="pt-3"
        >
          <template v-for="(col, index) in $_.reverse($_.range(1, 11))">
            <ContentLoader
              :key="index"
              :height="20"
              :width="1060"
              :speed="1"
              primaryColor="#e0e0e0"
              secondaryColor="#ededed"
            >
              <rect
                x="0"
                y="1.2"
                rx="3"
                ry="3"
                width="6"
                height="6"
              />
              <rect
                x="34"
                y="2"
                rx="3"
                ry="3"
                :width="400 * 0.1 * col"
                height="4"
              />
              <rect
                x="633"
                y="2"
                rx="3"
                ry="3"
                :width="40 * 0.1 * col"
                height="4"
              />
              <rect
                x="687"
                y="2"
                rx="3"
                ry="3"
                :width="78 * 0.1 * col"
                height="4"
              />
              <rect
                x="780"
                y="2"
                rx="3"
                ry="3"
                :width="117 * 0.1 * col"
                height="4"
              />
              <rect
                x="938"
                y="2"
                rx="3"
                ry="3"
                :width="83 * 0.1 * col"
                height="4"
              />
              <rect
                x="0"
                y="39"
                rx="3"
                ry="3"
                width="1060"
                height=".3"
              />
            </ContentLoader>
          </template>
        </div>

        <v-layout
          align-center
          column
          class="pa-3 ma-0 comment-border grey--text white elevation-1"
          v-if="$_.get(items, 'length') === 0 && !preloader"
        >
          <v-icon
            class="mb-1"
            color="grey"
          >cloud</v-icon>
          <div>Нет данных</div>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>
<style src="./style.scss" lang="scss"></style>
