import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import Auth from 'src/api/auth';
import { StoreInterface } from '../store';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default route<StoreInterface>(({ Vue }) => {
    Vue.use(VueRouter);

    // noinspection JSUnusedGlobalSymbols
    const Router = new VueRouter({
        scrollBehavior: () => ({ x: 0, y: 0 }),
        routes,

        // Leave these as is and change from quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE,
    });

    Router.beforeEach((to, from, next) => {
        if (to.name !== 'login' && !Auth.isAuthenticate()) {
            Auth.refreshTokenRequest().then((response: boolean) => {
                if (response) {
                    next();
                } else {
                    next({ name: 'login' });
                }
            });
        } else {
            next();
        }
    });

    return Router;
});
