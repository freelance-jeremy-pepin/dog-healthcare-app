import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
    {
        name: 'login',
        path: '/login',
        component: () => import('pages/Login.vue'),
    },
    {
        path: '/professionals',
        component: () => import('layouts/ProfessionalLayout.vue'),
        children: [
            {
                name: 'professionals',
                path: '',
                component: () => import('pages/Professionals/Professionals.vue'),
            },
            {
                name: 'professionals.add',
                path: 'add',
                component: () => import('pages/Professionals/ProfessionalsAdd.vue'),
            },
            {
                name: 'professionals.edit',
                path: 'edit/:professional_id',
                component: () => import('pages/Professionals/ProfessionalsEdit.vue'),
            },
        ],
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
