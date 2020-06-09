import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/Login.vue'),
  },
  {
    path: '/professionals',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      name: 'professionals',
      path: '',
      component: () => import('pages/Professionals.vue'),
    }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
      name: 'home',
      path: '',
      component: () => import('pages/Index.vue'),
    }],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
