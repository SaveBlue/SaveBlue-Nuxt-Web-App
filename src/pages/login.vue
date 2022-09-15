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
              />
              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                autocomplete="on"
              />
              <v-card-actions>
                <v-btn type="submit" color="background_color" :loading="loading" :disabled="loading">Login</v-btn>
                <v-btn color="primary" text absolute right to="register">Register</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.visible = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>

export default {
  name: 'Login',
  layout: 'empty',
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
      snackbar: {
        visible: false,
        timeout: 2000,
        color: null,
        text: '',
      },
      form: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false
    };
  },
  methods: {
    async userLogin() {
      try {
        this.loading = true;
        let response = await this.$auth.loginWith('local', { data: this.form });
      } catch (err) {
        if(err.message.includes("401")){
          this.snackbar.text = "Wrong Username or Password"
        }
        else {
          this.snackbar.text = "Error"
        }
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
      finally {
        this.loading = false;
      }
    }
  },
    /*...mapActions({
      login: 'auth/login'
    }),
    submit() {
      this.login(this.form).then(() => {
        this.$router.replace({name: 'Dashboard'})
      }).catch(() => {
        this.snackbar.text = "Napačno uporabniško ime ali geslo"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      })
    }
  }*/
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
