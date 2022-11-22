<template>
  <v-container>
    <v-row align="center">
        <v-col v-if="loading" cols="12" sm="6">
          <AccountCardSkeleton/>
        </v-col>
        <v-col v-if="loading" cols="12" sm="6">
          <AccountCardSkeleton/>
        </v-col>
      <v-col v-else cols="12" sm="6" v-for="account in accounts" :key="account._id">
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
  created() {
    useAccountStore().resetCurrent()
  },
  computed: {
    loading: () => useAccountStore().loading,
    accounts: () => useAccountStore().accounts
  }
}
</script>

<style scoped>

</style>
