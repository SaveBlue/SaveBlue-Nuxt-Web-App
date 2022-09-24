<template>
  <v-card
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
export default {
  name: "AccountOverviewCard",
  data() {
    return {
      loading: true
    }
  },
  props:{
    account: Object
  }
}
</script>

<style scoped>

</style>
