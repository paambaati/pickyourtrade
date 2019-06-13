import { stub } from 'sinon';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import store from '../src/store';

// Simple mutations tests.
// These commit to the store directly (for now).
// Ideally, this should be done on a mock/factory store instance.
describe('✨store.test.js/mutations', () => {
    test('auth_request should update status', () => {
        store.commit('auth_request');
        expect(store.state.status).toEqual('loading');
    });

    test('auth_success should update status, token & user', () => {
        store.commit('auth_success', {
            token: 'cGVuaXM=',
            user: 'test1',
        });
        expect(store.state.status).toEqual('success');
        expect(store.state.token).toEqual('cGVuaXM=');
        expect(store.state.user).toEqual('test1');
    });

    test('portfolio_modify_success should return the full portfolio with the modified ticker updated', () => {
        store.state.portfolio = [{
            id: 1,
            stockCount: 1
        }, {
            id: 2,
            stockCount: 0
        }];
        store.commit('portfolio_modify_success', {
            id: 2,
            stockCount: 99,
        });
        expect(store.state.portfolio[1].stockCount).toEqual(99);
    });
});

// Actions tests.
// This is to illustrate mocking Vuex actions.
describe('✨store.test.js/actions → mock function calls', () => {
    beforeEach(() => {
        const dispatchStub = stub(store, ['dispatch']);
        dispatchStub.callThrough(); // Allow other actions to be dispatched.
        dispatchStub.resolves({
            token: 'cGVuaXM=',
            user: 'test1',
        });
    });

    test('login should return a token and the user', async () => {
        const username = 'test1';
        const password = 'pass1';
        const result = await store.dispatch('login', { username, password });
        expect(result.token).toEqual('cGVuaXM=');
        expect(result.user).toEqual('test1');
    });
});

// Actions tests.
// This is to illustrate mocking external library function calls (e.g. Axios).
describe('✨store.test.js/actions → mock external API calls', () => {
    const mock = new AxiosMockAdapter(axios);
    beforeEach(() => {
        mock.onGet('/token').replyOnce(200, {
            user: 'test1',
            token: 'cGVuaXM=',
        });
    });

    afterEach(() => {
        mock.restore();
    });

    test('login should call the GET /token API', async ()=> {
        const username = 'test1';
        let password = 'pass1';
        const response = await store.dispatch('login', { username, password });
        expect(response).toEqual({
            user: 'test1',
            token: 'cGVuaXM='
        });
    });
});
