<template>
  <v-card
    class="mx-auto text-center"
  >

    <v-card-title>
      Available Balance
    </v-card-title>

    <v-card-subtitle>
      Start of Month: {{account.startOfMonth}}
    </v-card-subtitle>

    <v-card-text>
      <h1>{{account.availableBalance}} €</h1>
      <h3>{{account.totalBalance}} €</h3>
      <h5>(Total Balance)</h5>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  name: "AccountOverviewCard",
  props:{
    account: Object
  }
}
</script>

<style scoped>

</style>
