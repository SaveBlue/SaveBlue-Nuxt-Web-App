<template>
  <v-card
    class="mx-auto"
    :to="isNew ? 'account/create' :`/account/${account._id}`"
  >
    <div class="d-flex flex-no-wrap">
      <v-img
        :src="isNew ? 'addsavebluebanner.png':'savebluebanner.png'"
        max-width="33%"
      ></v-img>

      <div>
        <v-card-title v-if="isNew">New Account</v-card-title>
        <v-card-title v-else>{{ account.name }}</v-card-title>

        <v-card-title v-if="isNew"><br></v-card-title>
        <v-card-title v-else>{{ account.availableBalance/100 }} €</v-card-title>
      </div>
    </div>
  </v-card>

</template>

<script>
export default {
  name: "AccountCard",
  props: {
    account: Object,
    isNew: Boolean
  }
}
</script>

<style scoped>

</style>
