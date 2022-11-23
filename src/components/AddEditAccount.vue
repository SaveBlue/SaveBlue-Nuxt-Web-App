<template>
  <div>
    <!-- Loader -->
    <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
      <v-col cols="2">
        <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
      </v-col>
    </v-row>

    <!-- Content -->
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

        <v-toolbar-title v-if="edit">{{ currentAccount.name }}</v-toolbar-title>
        <v-toolbar-title v-else>New Account</v-toolbar-title>

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
                    <v-btn type="submit" color="primary" @click="handleCreateAccount">Create Account</v-btn>
                  </v-col>
                </v-row>
                <v-row v-show="edit" >
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" @click="handleUpdateAccount">Update Account</v-btn>

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
                @click="handleDeleteAccount"
              >
                Yes
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>

import {useAccountStore} from '@/store/account'
import {useSnackbarStore} from "@/store/snackbar";
import {useContext} from "@nuxtjs/composition-api";
export default {
  setup(){
    const context = useContext()

    return {context}
  },
  computed: {
    currentAccount: () => useAccountStore().current,
    loading: () => useAccountStore().getLoading,
    snackbar: () => useSnackbarStore()
  },
  data() {
    return {
      account: {
        name: "",
        startOfMonth: 1
      },
      dialog: false,
      //loading: this.edit,
      nameRules: [
        v => !!v || "Required Field",
        v => !!v && v.length <= 32 || "Field too Long",
      ],
    }
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  watch:{
    // Handle page refreshes
    loading(newValue, oldValue) {
      if (this.edit && oldValue && !newValue) {
        this.account = this.currentAccount
      }
    }
  },
  mounted() {
    // Handle route changes
    if(this.edit && !this.loading){
      (typeof this.currentAccount !== "undefined") && (this.account = this.currentAccount)
    }
  },
  methods: {
    async handleCreateAccount() {
      try {
        await useAccountStore().createAccount(this.account, this.context)
          .then((data) => {
              this.$router.push('/')
              this.snackbar.displayPrimary("Account created")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Account not created")
      }
    },
    async handleUpdateAccount() {
      try {
        await useAccountStore().updateAccount(this.account, this.context)
          .then((data) => {
              this.$router.push(`/account/${this.$route.params.idA}`)
              this.snackbar.displayPrimary("Account updated")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Account not updated")
      }
    },
    async handleDeleteAccount() {
      try {
        await useAccountStore().deleteAccount(this.context)
          .then(() => {
            this.$router.push('/')
            this.snackbar.displayPrimary("Account deleted")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Account not deleted")
      }
    }
  }
}
</script>

<style scoped>

</style>
