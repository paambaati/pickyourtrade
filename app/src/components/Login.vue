<template>
  <div class="container">
    <section class="section">
      <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-4-widescreen">
            <b-loading :active.sync="isLoggingIn" :is-full-page="false" :can-cancel="false">
            </b-loading>
            <form role="form" class="box" v-on:submit.prevent="login()">
              <b-message :active.sync="loginFailed" type="is-danger" aria-close-label="Close alert">
                😲Login failed. Please check your credentials!
              </b-message>
              
              <b-field label="Username">
                  <b-input v-model="username" required>
                  </b-input>
              </b-field>

              <b-field label="Password">
                  <b-input v-model="password" type="password" password-reveal required>
                  </b-input>
              </b-field>
              <b-button native-type="submit" class="is-primary">Login</b-button>
            </form>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      isLoggingIn: false,
      loginFailed: false,
    };
  },
  methods: {
    login: function() {
      this.isLoggingIn = true;
      this.loginFailed = false;
      const username = this.username;
      const password = this.password;
      this.$store
        .dispatch('login', { username, password })
        .then(() => this.$router.push('/tracker'))
        .catch(() => {
          this.loginFailed = true;
        })
        .finally(() => {
          this.isLoggingIn = false;
        });
    }
  }
};
</script>
