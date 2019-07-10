import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $_: any;
    $Axios: any;
    $Moment: any;
    $Uniqid: any;
    $SockJS: any;
    $Stomp: any;
    $API: any;
    $Helper: any;
    $EventBus: any;
  }
}
