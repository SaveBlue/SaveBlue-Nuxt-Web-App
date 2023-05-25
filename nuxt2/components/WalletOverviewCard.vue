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
      Billing day: {{wallet.startOfMonth}}
    </v-card-subtitle>

    <v-card-text>
      <h1>{{(wallet.availableBalance/100).toFixed(2)}} €</h1>
      <br>
      <h3>{{(wallet.totalBalance/100).toFixed(2)}} €</h3>
      <h5>(Total Balance)</h5>
    </v-card-text>
  </v-card>

</template>

<script>
import {useWalletStore} from "@/store/wallet";

export default {
  name: "WalletOverviewCard",
  computed:{
    wallet: () => useWalletStore().current,
    loading: () => useWalletStore().getLoading,
  }
}
</script>

<style scoped>

</style>
