// Глобальная регистрация библиотек в корневом компоненте Vue
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import uniqid from 'uniqid';
import sockjs from 'sockjs-client';
import stomp from 'stompjs';

@Component
export default class LibPlugin extends Vue {
  public install() {
    Object.defineProperty(Vue.prototype, '$Axios', { value: axios });
    Object.defineProperty(Vue.prototype, '$_', { value: lodash });
    Object.defineProperty(Vue.prototype, '$Moment', { value: moment });
    Object.defineProperty(Vue.prototype, '$Uniqid', { value: uniqid });
    Object.defineProperty(Vue.prototype, '$SockJS', { value: sockjs });
    Object.defineProperty(Vue.prototype, '$Stomp', { value: stomp });
  }
}
