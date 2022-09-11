<template>
  <div class="background">
    <v-container fill-height>
      <v-row justify="center">
        <v-card width="400" class="ma-3" elevation="12">
          <v-toolbar dark color="primary">
            <v-avatar size="50" class="my-1 mr-3 rounded-circle">
              <v-img src="logo.png"/>
            </v-avatar>
            <h1>Register</h1>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" @submit.prevent="userRegister">
              <v-text-field
                v-model="form.username"
                counter="32"
                label="Username"
                prepend-icon="mdi-account-circle"
                :rules="usernameRules"
              />
              <v-text-field
                v-model="form.email"
                counter="128"
                prepend-icon="mdi-email"
                label="Email"
                :rules="emailRules"
              />
              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="passwordRules"
              />
              <v-text-field
                v-model="form.password2"
                :type="showPassword2 ? 'text' : 'password'"
                label="Repeat Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword2 = !showPassword2"
                :rules="password2Rules"
              />
              <v-card-actions>
                <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Register</v-btn>
                <v-btn color="primary" text absolute right to="register" @click="$router.push('login')">Back</v-btn>
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
  auth: false,
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
        password: '',
        password2: '',
        email: ''
      },
      showPassword: false,
      showPassword2: false,
      loading: false,
      usernameRules: [
        v => !!v || 'Required Field',
        v => v.length <= 32 || 'Username too long',
      ],
      passwordRules: [
        v => !!v || 'Required Field',
        v => v.length <= 128 || 'Password too long',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password not strong enough',
      ],
      password2Rules: [
        v => !!v || 'Required Field',
        v => this.matchRule()
      ],
      emailRules: [
      v => !!v || "Required Field",
      v => !!v && v.length <= 128 || "Field too Long",
      v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "Invalid email"
    ]
    };
  },
  methods: {
    async userRegister() {
      if (this.$refs.form.validate()) {
        try {
          await this.$axios.post(
            '/auth/register',
            this.form
          ).then(
            () => {
              this.$router.push('login')
            }
          )
            .catch(error => {
            this.snackbar.color = "error";
            this.snackbar.visible = true;
            this.snackbar.text = error.response.status === 409 ? "Username or email already exists" : "Error creating user profile"
          })
        }
        catch{
          this.snackbar.text = "Invalid registration data"
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        }
      }
      else {
        this.snackbar.text = "Invalid registration data"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    },
  },
  computed: {
    matchRule() {
      return () => (this.form.password === this.form.password2) || 'Passwords must match'
    }
  },

}
</script>

<style scoped>

.background {
  height: 100vh !important;
}

</style>
