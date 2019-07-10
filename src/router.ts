import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('./views/login/Login.vue'),
    },
    {
      path: '/list/:listId',
      name: 'modelCardList',
      component: () => import('./views/model/List.vue'),
    },
    {
      path: '/card/:modelId/:objectId?',
      name: 'modelCard',
      component: () => import('./views/model/Card.vue'),
    },
    {
      path: '/',
      name: 'main',
      component: () => import('./views/Main.vue'),
    },
    {
      path: '/data-model',
      name: 'dataModel',
      component: () => import('./views/admin/dataModel/ListModel.vue'),
    },
    {
      path: '/data-model/:id',
      name: 'dataModelForm',
      component: () => import('./views/admin/dataModel/form/Form.vue'),
    },
    {
      path: '/data-rules',
      name: 'dataRules',
      component: () => import('./views/admin/dataRules/ListRules.vue'),
    },
    {
      path: '/data-rules/:id',
      name: 'dataRulesForm',
      component: () => import('./views/admin/dataRules/form/Form.vue'),
    },
    {
      path: '/data-view',
      name: 'dataView',
      component: () => import('./views/admin/dataView/ListView.vue'),
    },
    {
      path: '/data-view/add',
      name: 'dataModelViewAdd',
      component: () => import('./views/admin/dataView/form/Form.vue'),
    },
    {
      path: '/data-view/:id',
      name: 'dataModelView',
      component: () => import('./views/admin/dataView/form/Form.vue'),
    },
    {
      path: '/header-view',
      name: 'headerView',
      component: () => import('./views/admin/headerView/ListView.vue'),
    },
    {
      path: '/header-view/add',
      name: 'headerModelViewAdd',
      component: () => import('./views/admin/headerView/form/Form.vue'),
    },
    {
      path: '/header-view/:id',
      name: 'headerModelView',
      component: () => import('./views/admin/headerView/form/Form.vue'),
    },
    {
      path: '/menu-rules/',
      name: 'menuRules',
      component: () => import('./views/admin/menuRules/MenuRules.vue'),
    },
    {
      path: '/data-triggers',
      name: 'dataTriggers',
      component: () => import('./views/admin/dataTriggers/List.vue'),
    },
    {
      path: '/data-triggers/:objectClass',
      name: 'dataTriggersForm',
      component: () => import('./views/admin/dataTriggers/form/Form.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === 'main' && store.getters['state/STATES'].page.main.id) {
    next({
      name: 'modelCardList',
      params: { listId: store.getters['state/STATES'].page.main.id },
    });
  } else if (!store.getters['auth/isAuthenticated'] && to.name !== 'login') {
    next({ name: 'login' });
  } else if (store.getters['auth/isAuthenticated'] && to.name === 'login') {
    next({ name: 'main' });
  } else {
    next();
  }
});

export default router;
