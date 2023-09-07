<template>
  <v-container>
    <v-row align="center">
        <v-col v-if="loading" cols="12" sm="6">
          <WalletCardSkeleton/>
        </v-col>
        <v-col v-if="loading" cols="12" sm="6">
          <WalletCardSkeleton/>
        </v-col>
      <v-col v-else cols="12" sm="6" v-for="wallet in wallets" :key="wallet._id">
        <WalletCard :wallet="wallet"/>
      </v-col>
      <v-col cols="12" sm="6">
        <WalletCard :is-new="true"/>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import {useWalletStore} from '@/store/wallet'

export default {
  created() {
    useWalletStore().resetCurrent()
  },
  computed: {
    loading: () => useWalletStore().getLoading,
    wallets: () => useWalletStore().wallets
  }
}
</script>

<style scoped>

</style>
