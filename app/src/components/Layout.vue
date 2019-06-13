<template>
  <div id="layout">
    <header>
      <nav class="navbar docs-navbar is-spaced has-shadow">
        <div class="container">
          <div class="navbar-brand">
            <router-link to="/" class="navbar-item is-active" title="PickYourTrade">
              <h1>💰 PickYourTrade</h1>
            </router-link>
          </div>
          <div class="navbar-menu">
            <div class="navbar-end">
                <div v-if="isLoggedIn" class="buttons">
                  <router-link to="/tracker" v-if="$route.path !== '/tracker'" tag="button" class="navbar-item button is-primary"><b-icon icon="chart-donut"/>&nbsp;&nbsp;&nbsp;Portfolio Tracker</router-link>
                  <router-link to="/search" v-if="$route.path === '/tracker'" tag="button" class="navbar-item button is-primary"><b-icon icon="magnify"/>&nbsp;&nbsp;&nbsp;Search</router-link>
                  <button native-type="button" @click="logout" class="navbar-item button">Logout</button>
                </div>
                <div v-else-if="$route.path !== '/login'" class="buttons">
                  <router-link to="/login" tag="button" class="button is-primary">
                    <b-icon icon="account"/>&nbsp;&nbsp;&nbsp;Login
                  </router-link>
                </div>
            </div>
          </div>
        </div>
      </nav>
      <main class="container is-fullhd is-fluid">
        <router-view/>
      </main>
    </header>
  </div>
</template>

<script>
import Login from './Login';
import Search from './Search';
import Tracker from './Tracker';
export default {
  name: 'layout',
  components: {
    Login,
    Search,
    Tracker,
  },
  computed: {
      isLoggedIn: function() {
        return this.$store.getters.isLoggedIn;
      },
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      });
    },
    created: function() {
      this.$http.interceptors.response.use(undefined, (err) => {
        return new Promise((resolve, reject) => {
          if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
            this.$store.dispatch('logout');
            return resolve();
          }
          return reject(err);
        });
      });
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 200%;
  font-weight: 800;
}
.navbar-item.button {
    padding: 0.3rem 0.75rem;
}
</style>