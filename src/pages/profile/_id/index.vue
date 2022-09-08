<template>
  <div>
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
      profile: {
        username: "",
        email: ""
      },
      snackbar: {
        visible: false,
        timeout: 2000,
        color: null,
        text: '',
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
              /*this.snackbar.text = "Profile updated";
              this.snackbar.color = "success";
              this.snackbar.visible = true;*/
            }
          )
        } catch {
          this.snackbar.text = "Error updating profile"
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        }
      } else {
        this.snackbar.text = "Invalid profile data"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
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
          }
        )
      } catch {
        this.snackbar.text = "Error deleting profile"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
