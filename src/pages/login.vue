<template>
  <div class="background">
    <v-container fill-height>
      <v-row justify="center">
        <v-card width="400" class="ma-3" elevation="12">
          <v-toolbar dark color="primary">
            <v-avatar size="50" class="my-1 mr-3 rounded-circle">
              <v-img src="logo.png"/>
            </v-avatar>
            <h1>Login</h1>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" @submit.prevent="userLogin">
              <v-text-field
                v-model="form.username"
                label="Username"
                prepend-icon="mdi-account-circle"
                :disabled="loading"
              />
              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                autocomplete="on"
                :disabled="loading"
              />
              <v-card-actions>
                <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Login</v-btn>
                <v-btn color="primary" text absolute right to="register" :disabled="loading">Register</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import {useSnackbarStore} from "~/store/snackbar";

export default {
  name: 'Login',
  layout: 'auth',
  metaInfo() {
    return {
      meta: [
        {
          name: "robots",
          content: "noindex"
        }
      ]
    }
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false
    };
  },
  computed: {
    snackbar: () => useSnackbarStore()
  },
  methods: {
    async userLogin() {
      try {
        this.loading = true;
        let response = await this.$auth.loginWith('local', {data: this.form});
        console.log(response)
      } catch (err) {
        if (err.message.includes("401")) {
          this.snackbar.displayError("Wrong Username or Password")
        } else {
          this.snackbar.displayError("Error")
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.background {
  height: 100vh !important;

  /*background-image: linear-gradient(0deg, rgba(26, 26, 26, 0.5), rgba(26, 26, 26, 0.5)), url("../../assets/ljubljana.jpg");

  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;*/
}

</style>
