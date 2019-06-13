import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Layout from '../src/components/Layout.vue';
import Login from '../src/components/Login.vue';
import routes from '../src/router.js';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

describe('✨router.test.js', () => {
    test('renders a child component via routing', () => {
        const store = new Vuex.Store({
            getters: {
                isLoggedIn: () => false,
            },
        });
        const router = new VueRouter({ routes: routes.routes });
        const wrapper = shallowMount(Layout, { localVue, store, router });
        router.push('/login');
        // The login button is hidden on the Login page, so we can test that.
        expect(wrapper.find('.buttons').exists()).toBe(false);
    });
});
