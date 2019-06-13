import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const backendEndpoint = 'http://localhost:4200';

function readUserDetailsFromToken(token) {
    const decodedToken = window.atob(token);
    const [username, password] = decodedToken.split(':');
    return {
        username,
        password,
    }
}

function calculateDerivedPortfolioFields(portfolio) {
    return portfolio.map(ticker => {
        ticker['totalValue'] = (ticker.stockCount * ticker.stockPurchasePrice).toFixed(2);
        ticker['profit'] = ((ticker.currentPrice - ticker.stockPurchasePrice) * ticker.stockCount).toFixed(2);
        return ticker;
    });
}

let store = new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: localStorage.getItem('token') ? readUserDetailsFromToken(localStorage.getItem('token')) : {},
        lastAdded: {},
        portfolio: [],
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, authData) {
            state.status = 'success';
            state.token = authData.token;
            state.user = authData.user;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
            state.user = {};
        },
        add_ticker(state, payload) {
            // Normalize the payload before committing to state.
            state.lastAdded = {
                ticker: payload.selected['1. symbol'],
                company: payload.selected['2. name'],
                region: payload.selected['4. region'],
                stockCount: payload.stockCount,
                stockPurchasePrice: payload.stockPurchasePrice,
                ...payload.tickerData,
            };
        },
        portfolio_fetch_success(state, portfolio) {
            state.portfolio = portfolio;
        },
        portfolio_add_success(state, ticker) {
            state.portfolio.push(ticker);
        },
        portfolio_modify_success(state, updatedTicker) {
            state.portfolio = state.portfolio.map(ticker => {
                if (ticker.id === updatedTicker.id) {
                    return updatedTicker; 
                }
                return ticker;
            });
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                return axios({ url: `${backendEndpoint}/token/${user.username}?password=${user.password}`, method: 'GET' })
                    .then(resp => {
                        // eslint-disable-next-line
                        console.log('login response = ', resp, ' user = ', user);
                        const token = resp.data.token;
                        localStorage.setItem('token', token);
                        commit('auth_success', { token, user });
                        return resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        return reject(err);
                    });
            });
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                return resolve();
            });
        },
        addToPortfolio({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                commit('add_ticker', payload);
                const username = {...state.user}.username;
                const ticker = {...this.state.lastAdded};
                return axios({
                        url: `${backendEndpoint}/portfolio/${username}`,
                        method: 'PUT',
                        withCredentials: false,
                        headers: {
                            // Do this still, because this is how we can get
                            // the auth header to attach after page reloads.
                            Authorization: `Basic ${localStorage.getItem('token')}`,
                        },
                        data: ticker,
                    })
                    .then(() => {
                        commit('portfolio_add_success', ticker);
                        return resolve(ticker);
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        getPortfolio({ commit, state }) {
            return new Promise((resolve, reject) => {
                const username = {...state.user}.username;
                return axios({
                        url: `${backendEndpoint}/portfolio/${username}`,
                        method: 'GET',
                        withCredentials: false,
                        headers: {
                            // Do this still, because this is how we can get
                            // the auth header to attach after page reloads.
                            Authorization: `Basic ${localStorage.getItem('token')}`,
                        }
                    })
                    .then(resp => {
                        commit('portfolio_fetch_success', resp.data);
                        return resolve({...resp.data});
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
        updatePortfolio({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
                const username = {...state.user}.username;
                const { totalValue, profit, ...updates } = payload;
                return axios({
                        url: `${backendEndpoint}/portfolio/${username}`,
                        method: 'PATCH',
                        withCredentials: false,
                        headers: {
                            // Do this still, because this is how we can get
                            // the auth header to attach after page reloads
                            // and state is lost as a result.
                            Authorization: `Basic ${localStorage.getItem('token')}`,
                        },
                        data: updates,
                    })
                    .then(resp => {
                        commit('portfolio_modify_success', resp.data.updated);
                        return resolve({...resp.data});
                    })
                    .catch(err => {
                        return reject(err);
                    });
            });
        },
    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        lastAdded: state => state.lastAdded,
        portfolio: state => calculateDerivedPortfolioFields(state.portfolio),
    }
});

export default store;
