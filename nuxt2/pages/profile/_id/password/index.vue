<template>
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
</template>

<script>
import {useSnackbarStore} from "~/store/snackbar";

export default {
  data() {
    return {
      dialog: false,
      password1: "",
      password2: "",
      showPassword1: false,
      showPassword2: false,
      passwordRules: [
        v => !!v || 'Required Field',
        v => v.length <= 128 || 'Password too long',
        v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password not strong enough',
      ],
    }
  },
  methods: {
    async updatePassword() {
      if (this.$refs.form.validate()) {
        try {
          await this.$axios.put(
            `/users/${this.$route.params.id}`,
            {"password": this.password1},
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          ).then(
            () => {
              this.$auth.logout();
              this.snackbar.displaySuccess("Password changed")
            }
          )
        } catch {
          this.snackbar.displayError("Error updating password")
        }
      } else {
        this.snackbar.displayError("Invalid password data")
      }
    },
  },
  computed: {
    snackbar: () => useSnackbarStore(),
    matchRule() {
      return () => (this.password1 === this.password2) || 'Passwords must match'
    }
  },
}
</script>

<style scoped>

</style>
