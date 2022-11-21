<template>

  <!-- Loader -->
    <v-card v-if="loading" height="190" class="py-3">
      <v-skeleton-loader type="image" height="100%"/>
    </v-card>

  <!-- Content -->
  <v-card
    v-else
    class="mx-auto text-center"
  >

    <v-card-title class="justify-center">
      Available Balance
    </v-card-title>

    <v-card-subtitle>
      Billing day: {{account.startOfMonth}}
    </v-card-subtitle>

    <v-card-text>
      <h1>{{(account.availableBalance/100).toFixed(2)}} €</h1>
      <br>
      <h3>{{(account.totalBalance/100).toFixed(2)}} €</h3>
      <h5>(Total Balance)</h5>
    </v-card-text>
  </v-card>

</template>

<script>
import {useAccountStore} from "@/store/account";

export default {
  name: "AccountOverviewCard",
  computed:{
    account: () => useAccountStore().current,
    loading: () => useAccountStore().loading,
  }
}
</script>

<style scoped>

</style>
