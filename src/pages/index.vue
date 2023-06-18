<template>
  <v-container>

    <v-row align="center">
      <v-col v-if="getLoading" cols="12" sm="6">
        <WalletCardSkeleton/>
      </v-col>
      <v-col v-if="getLoading" cols="12" sm="6">
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
  {{getLoading}}
</template>

<script setup>
import {useWalletStore} from '~/stores/wallet'
import {storeToRefs} from "pinia";

const walletStore = useWalletStore()
const {getLoading, wallets} = storeToRefs(walletStore);

walletStore.resetCurrent()

</script>

<style scoped>

</style>
