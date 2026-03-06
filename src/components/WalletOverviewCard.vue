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

    <v-card-text>
      <h1>{{(wallet.availableBalance/100).toFixed(2)}} €</h1>
      <br>
      <h3>{{((wallet.availableBalance + (wallet.investedAmount || 0))/100).toFixed(2)}} €</h3>
      <h5>(Total Balance)</h5>
      <div v-if="wallet.investedAmount" class="mt-1">
        <span class="caption grey--text">Invested: {{(wallet.investedAmount/100).toFixed(2)}} €</span>
      </div>
      <div v-if="wallet.startOfMonth" class="mt-1">
        <span class="caption grey--text">Billing day: {{wallet.startOfMonth}}</span>
      </div>
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
