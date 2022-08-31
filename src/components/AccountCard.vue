<template>
  <v-card
    class="mx-auto"
    :to="`/account/${account._id}`"
  >
    <v-img
      src="savebluebanner.png"
      height="200px"
    ></v-img>

    <v-card-title>{{account.name}}</v-card-title>

    <v-card-title>{{account.availableBalance}}</v-card-title>
  </v-card>

</template>

<script>
export default {
  name: "AccountCard",
  props: {
    account: Object
  }
}
</script>

<style scoped>

</style>
