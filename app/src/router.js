import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: { name: 'search' },
            name: 'layout',
            component: Vue.component('Layout', require('./components/Layout.vue').default),
            children: [
                {
                    path: '/search',
                    name: 'search',
                    component: Vue.component('Search', require('./components/Search.vue').default),
                },
                {
                    path: '/login',
                    name: 'login',
                    component: Vue.component('Login', require('./components/Login.vue').default),
                },
                {
                    path: '/tracker',
                    name: 'tracker',
                    component: Vue.component('Tracker', require('./components/Tracker.vue').default),
                    meta: {
                        requiresAuth: true,
                    }
                },
            ],
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn) {
            next();
            return;
        }
        next('/login');
    } else {
        next();
    }
});

export default router;
