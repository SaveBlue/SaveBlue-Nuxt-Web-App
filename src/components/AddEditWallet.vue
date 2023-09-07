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

        <v-toolbar-title v-if="edit">{{ currentWallet.name }}</v-toolbar-title>
        <v-toolbar-title v-else>New Wallet</v-toolbar-title>

      </v-app-bar>
      <v-container>
        <v-card>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-text-field
                  v-model="wallet.name"
                  :counter="32"
                  label="Wallet Name"
                  prepend-icon="mdi-wallet"
                />
                <v-slider
                  label="Billing day"
                  prepend-icon="mdi-update"
                  v-model="wallet.startOfMonth"
                  min="1"
                  max="31"
                  thumb-label
                  ticks
                />
                <v-row v-show="!edit">
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" @click="handleCreateWallet">Create Wallet</v-btn>
                  </v-col>
                </v-row>
                <v-row v-show="edit" >
                  <v-col cols="12">
                    <v-btn type="submit" color="primary" @click="handleUpdateWallet">Update Wallet</v-btn>

                    <v-btn class="my-3" type="submit" color="error" text @click="dialog=true">Delete Wallet</v-btn>
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
              Delete Wallet?
            </v-card-title>

            <v-card-text>
              Delete the wallet and all its contents?
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
                @click="handleDeleteWallet"
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

import {useWalletStore} from '@/store/wallet'
import {useSnackbarStore} from "@/store/snackbar";
import {useContext} from "@nuxtjs/composition-api";
export default {
  setup(){
    const context = useContext()

    return {context}
  },
  computed: {
    currentWallet: () => useWalletStore().current,
    loading: () => useWalletStore().getLoading,
    snackbar: () => useSnackbarStore()
  },
  data() {
    return {
      wallet: {
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
        this.wallet = this.currentWallet
      }
    }
  },
  mounted() {
    // Handle route changes
    if(this.edit && !this.loading){
      (typeof this.currentWallet !== "undefined") && (this.wallet = this.currentWallet)
    }
  },
  methods: {
    async handleCreateWallet() {
      try {
        await useWalletStore().createWallet(this.wallet, this.context)
          .then((data) => {
              this.$router.push('/')
              this.snackbar.displayPrimary("Wallet created")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Wallet not created")
      }
    },
    async handleUpdateWallet() {
      try {
        await useWalletStore().updateWallet(this.wallet, this.context)
          .then((data) => {
              this.$router.push(`/wallet/${this.$route.params.idW}`)
              this.snackbar.displayPrimary("Wallet updated")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Wallet not updated")
      }
    },
    async handleDeleteWallet() {
      try {
        await useWalletStore().deleteWallet(this.context)
          .then(() => {
            this.$router.push('/')
            this.snackbar.displayPrimary("Wallet deleted")
            }
          )
      } catch(error) {
        this.snackbar.displayError("Wallet not deleted")
      }
    }
  }
}
</script>

<style scoped>

</style>
