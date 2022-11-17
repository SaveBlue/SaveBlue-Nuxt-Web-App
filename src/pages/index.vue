<template>
  <v-container>
    <v-row align="center">
      <v-col v-show="accountStore.loading" cols="12" sm="6" v-for="i in 2" :key="i">
        <account-card-skeleton/>
      </v-col>
      <v-col cols="12" sm="6" v-for="account in accountStore.accounts" :key="account._id">
        <AccountCard :account="account"/>
      </v-col>
      <v-col cols="12" sm="6">
        <AccountCard :is-new="true"/>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import {useAccountStore} from '@/store/account'
export default {
  setup(){
    const accountStore = useAccountStore()

    // Fetch accounts
    accountStore.fetchAccounts()

    return {accountStore}
  },
  data() {
    return {
      //accounts: [],
      //loading: true,
      //accountStore: useAccountStore()
    }
  },
  mounted() {
    useAccountStore().resetCurrent()
  }
  /*async fetch() {
    this.accounts = await this.$axios.$get(
      `/accounts/${this.$auth.user._id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    ).finally(() => this.loading = false)
    setTimeout(() => this.loading = false, 1000)
  },*/
  /*beforeMount(){
  this.accountStore.fetchAccounts()
  }*/
}
</script>

<style scoped>

</style>
