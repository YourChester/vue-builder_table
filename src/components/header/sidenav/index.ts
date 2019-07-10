import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'sidenav',
})
export default class Sidenav extends Vue {
  public menu: any = {
    views: [],
    configuration: {
      visible: false,
      items: [
        {
          route: 'dataModel',
          name: 'Модели данных',
        },
        {
          route: 'dataView',
          name: 'Представления данных',
        },
        {
          route: 'headerView',
          name: 'Представления реестров',
        },
        {
          route: 'menuRules',
          name: 'Меню',
        },
        {
          route: 'dataRules',
          name: 'Правила',
        },
        {
          route: 'dataTriggers',
          name: 'Триггеры',
        },
      ],
    },
  };

  get storeUser() {
    return this.$store.getters['user/ITEM'];
  }

  get storeState() {
    return this.$store.getters['state/STATES'];
  }

  set storeState(value) {
    this.$store.commit('state/CHANGE_STATE', value);
  }

  public async created() {
    try {
      this.$EventBus.$on('UPDATE_VIEW', () => {
        this.getMenu();
      });
    } catch (e) {}
  }

  public beforeDestroy() {
    this.$EventBus.$off('UPDATE_VIEW');
  }

  public closeSidenav() {
    this.storeState.sidenav.isActive = false;
  }

  public async getMenu() {
    try {
      if (!this.$store.getters['auth/isAuthenticated']) {
        return false;
      }

      // Конфигурация меню
      // const rulesMenu = await this.$API.object.menu.current();
      const vm = this;
      this.$nextTick(() => {
        const rulesMenu = vm.storeState.menuCurrent;
        vm.getFilter(rulesMenu);
      });
    } catch (e) {}
  }

  public getFilter(rulesMenu: any) {
    this.menu.views = this.$_.filter(
      this.$_.get(rulesMenu, 'models', []),
      (item: any) => this.$_.get(item, 'visible'),
    );

    this.menu.configuration.visible = this.$_.get(
      rulesMenu,
      'configuration',
      true,
    );
  }

  public logout() {
    this.closeSidenav();
    this.$store.dispatch('auth/AUTH_LOGOUT').then((result: any) => {
      if (result.success) {
        this.$router.push('/login');
      }
    });
  }

  public openLink(route: object) {
    this.closeSidenav();
    this.$router.push(route);
  }
}
