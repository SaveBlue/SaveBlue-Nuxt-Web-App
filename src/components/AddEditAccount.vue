<template>
  <div>
    <!-- progress loader -->
    <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
      <v-col cols="2">
        <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
      </v-col>
    </v-row>
    <div v-else>
      <v-app-bar
        fixed
        color="primary"
        dark
        app
      >
        <v-app-bar-nav-icon @click="$router.back()">
          <v-icon>mdi-close</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title v-if="edit">{{ account.name }}</v-toolbar-title>
        <v-toolbar-title v-else> New Account</v-toolbar-title>

      </v-app-bar>
      <v-container>
        <v-card>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-text-field
                  v-model="account.name"
                  :counter="32"
                  label="Account Name"
                  prepend-icon="mdi-wallet"
                />
                <v-slider
                  label="Billing day"
                  prepend-icon="mdi-update"
                  v-model="account.startOfMonth"
                  min="1"
                  max="31"
                  thumb-label
                  ticks
                />
                <v-row v-show="!edit">
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" @click="createAccount">Create Account</v-btn>
                  </v-col>
                </v-row>
                <v-row v-show="edit" >
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" @click="updateAccount">Update Account</v-btn>

                    <v-btn class="my-3" type="submit" color="error" text @click="dialog=true">Delete Account</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-dialog
          v-model="dialog"
          max-width="290"
        >
          <v-card>
            <v-card-title class="text-h5">
              Delete Account?
            </v-card-title>

            <v-card-text>
              Delete the account and all its contents?
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
                @click="deleteAccount"
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
  </div>
</template>

<script>

export default {
  name: "AddEditAccount",
  data() {
    return {
      dialog: false,
      loading: this.edit,
      account: {
        name: "",
        startOfMonth: 1
      },
      nameRules: [
        v => !!v || "Required Field",
        v => !!v && v.length <= 32 || "Field too Long",
      ],
      snackbar: {
        visible: false,
        timeout: 2000,
        color: null,
        text: '',
      },
    }
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }

  },
  async fetch() {
    if (this.edit) {
      await this.$axios.$get(
        `/accounts/find/${this.$route.params.id}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      ).then(response => {
        this.account.name = response.name
        this.account.startOfMonth = response.startOfMonth
      }).finally(
        () => this.loading = false
      )
    }
  },
  methods: {
    async createAccount() {
      try {
        await this.$axios.post(
          `/accounts/${this.$auth.user._id}`,
          this.account,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.$router.push('/')
          }
        )
      } catch {
        this.snackbar.text = "Napaka"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }

    },
    async updateAccount() {
      try {
        await this.$axios.put(
          `/accounts/${this.$route.params.id}`,
          this.account,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.snackbar.text = "Account Updated"
            this.snackbar.color = "success";
            this.snackbar.visible = true;
          }
        )
      } catch {
        this.snackbar.text = "Napaka"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }

    },
    async deleteAccount() {
      try {
        await this.$axios.delete(
          `/accounts/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.$router.push('/')
          }
        )
      } catch {
        this.snackbar.text = "Napaka"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }

    }
  }
}
</script>

<style scoped>

</style>
