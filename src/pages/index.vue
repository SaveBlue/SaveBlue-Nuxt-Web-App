<template>
  <v-container>
    <v-row align="center">
      <v-col cols="12" sm="6" v-for="account in accounts" :key="account._id">
        <AccountCard :account="account"/>
      </v-col>
      <v-col cols="12" sm="6">
        <NewAccountCard/>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  name: "index",
  data() {
    return {
      accounts: []
    }
  },
  async fetch() {
    this.accounts = await this.$axios.$get(
      `/accounts/${this.$auth.user._id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );
  }
}
</script>

<style scoped>

</style>
