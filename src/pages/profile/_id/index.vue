<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>Edit Profile Details</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="profile.username"
              counter="32"
              label="Username"
              :rules="usernameRules"
            />
            <v-text-field
              v-model="profile.email"
              counter="128"
              label="Email"
              :rules="emailRules"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateProfile">Update profile</v-btn>
          <v-btn text color="error" @click="dialog = true">Delete profile</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Delete Account?
        </v-card-title>

        <v-card-text>
          Delete the account and all its contents? Account data will be removed and the action is irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            @click="dialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="error"
            text
            @click="deleteProfile"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import {useSnackbarStore} from "~/store/snackbar";

export default {
  data() {
    return {
      dialog: false,
      profile: {
        username: "",
        email: ""
      },
      usernameRules: [
        v => !!v || "Required Field",
        v => !!v && v.length <= 32 || "Field too Long",
      ],
      emailRules: [
        v => !!v || "Required Field",
        v => !!v && v.length <= 128 || "Field too Long",
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "Invalid email"
      ]
    }
  },
  computed: {
    snackbar: () => useSnackbarStore()
  },
  async fetch() {
    await this.$axios.$get(
      `/users/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    ).then(response => {
      this.profile.username = response.username
      this.profile.email = response.email
    })
  },
  methods: {
    async updateProfile() {
      if (this.$refs.form.validate()) {
        try {
          await this.$axios.put(
            `/users/${this.$route.params.id}`,
            this.profile,
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          ).then(
            () => {
              this.$auth.logout();
              this.snackbar.displaySuccess("Profile updated")
            }
          )
        } catch {
          this.snackbar.displayError("Error updating profile")
        }
      } else {
        this.snackbar.displayError("Invalid profile data")
      }
    },
    async deleteProfile() {
      try {
        await this.$axios.delete(
          `/users/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.$auth.logout();
            this.snackbar.displaySuccess("User profile deleted")
          }
        )
      } catch {
        this.snackbar.displayError("Error deleting profile")
      }
    }
  }
}
</script>

<style scoped>

</style>
