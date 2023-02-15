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
        color="accent"
        dark
        fab
      >
        <v-icon class="toggleUpDown" :class='{ "rotate": fab }'>
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
    walletID : String
  }
}
</script>

<style scoped>

.toggleUpDown {
  transition: transform .3s ease-in-out !important;
}

.toggleUpDown.rotate {
  transform: rotate(45deg);
}

</style>
