<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
    fixed
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="orange"
        dark
        fab
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-plus
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      small
      color="red"
      to="/expense/add"
    >
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="green"
      to="/income/add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: "IncomeExpenseFAB",
  data() {
    return {
      fab: false
    }
  },
  props: {
    accountID : String
  }
}
</script>

<style scoped>

</style>
