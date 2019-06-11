import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import store from './store';
import router from './router';
import App from './components/Home.vue';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(Buefy);

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app');
