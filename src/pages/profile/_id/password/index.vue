<template>
  <div>
    <v-container>
      <v-row align="center" justify="center" class="pa-4">
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="password1"
                :counter="128"
                label="New Password"
                :rules="passwordRules"
                :type="showPassword1 ? 'text' : 'password'"
                :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword1 = !showPassword1"
              ></v-text-field>
              <v-text-field
                v-model="password2"
                :counter="128"
                label="Repeat New Password"
                :rules=[matchRule]
                :type="showPassword2 ? 'text' : 'password'"
                :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword2 = !showPassword2"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updatePassword">Update password</v-btn>
          </v-card-actions>
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
  data() {
    return {
      dialog: false,
      password1: "",
      password2: "",
      showPassword1: false,
      showPassword2: false,
      snackbar: {
        visible: false,
        timeout: 2000,
        color: null,
        text: '',
      },
      passwordRules: [
        v => !!v || 'Required Field',
        v => v.length <= 128 || 'Password too long',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password not strong enough',
      ],
    }
  },
  methods: {
    async updatePassword() {
      if (this.$refs.form.validate()){
        try {
          await this.$axios.put(
            `/users/${this.$route.params.id}`,
            {"password": this.password1},
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          ).then(
            () => {
              this.$auth.logout();
            }
          )
        } catch {
          this.snackbar.text = "Error updating password"
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        }
      }
      else{
        this.snackbar.text = "Invalid password data"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    },
  },
  computed: {
    matchRule() {
      return () => (this.password1 === this.password2) || 'Passwords must match'
    }
  },
}
</script>

<style scoped>

</style>
