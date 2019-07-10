<template>
  <v-layout
    row
    wrap
  >
    <v-flex xs8>
      <ChatItem
        :object-id="cerentIdChat"
        :comment-field="fieldForMessage"
        :users-field="fieldForUsers"
        :users="users"
        :creator="creator"
        :card-access="cardAccessForChat"
        :reset="reset"
        @update-users='loadUsers'
      ></ChatItem>
    </v-flex>
    <v-flex xs4>
      <ChatList
        :card-access="cardAccess"
        :object-id="reference"
        :object-card-id="objectId"
        :id-chats="idChats"
        :comment-field="commentField"
        @rules-update="updateRules"
        @open-chat="openChat"
      ></ChatList>
    </v-flex>
  </v-layout>
</template>
<script src="./index.ts" lang="ts"></script>
