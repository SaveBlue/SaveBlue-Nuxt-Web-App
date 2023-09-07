<template>
  <v-card
    class="mx-auto"
    hover
    :to="`/${this.isExpense ? 'expense': 'income'}/${incomeExpense._id}/edit`"
  >

    <v-card-title class="pr-0 pb-0">{{ incomeExpense.category1 }}<span
      v-show="isExpense">&nbsp/ {{ incomeExpense.category2 }}</span></v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">

      <v-card-subtitle class="align-self-center py-1">{{ incomeExpense.date.split("T")[0] }}</v-card-subtitle>

      <v-card-title class=" align-self-center py-1">{{ (incomeExpense.amount / 100).toFixed(2) }} €</v-card-title>

    </div>
    <v-card-text class="pt-0">{{ incomeExpense.description }}</v-card-text>

  </v-card>
</template>

<script>
export default {
  name: "IncomesExpensesTable",
  data() {
    return {
      showDetails: false
    }
  },
  props: {
    isExpense: Boolean,
    incomeExpense: Object
  }
}
</script>

<style scoped>

</style>
