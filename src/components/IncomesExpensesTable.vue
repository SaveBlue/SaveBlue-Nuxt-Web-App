<template>
  <v-card
    class="mx-auto"
  >

    <v-card-title>{{incomeExpense.category1}}<span v-show="isExpense">&nbsp/ {{incomeExpense.category2}}</span></v-card-title>

    <v-card-subtitle>{{incomeExpense.date}}</v-card-subtitle>

    <v-card-title>{{incomeExpense.amount}} €</v-card-title>

    <v-card-text>{{incomeExpense.description}}</v-card-text>
    <v-btn
      color="primary"
      text
      :to="`/${this.isExpense ? 'expense': 'income'}/${incomeExpense._id}/edit`"
    >
      Edit
    </v-btn>

    <!--<v-card-actions>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="showDetails = !showDetails"
      >
        <v-icon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showDetails">

        <v-card-text>{{incomeExpense.description}}</v-card-text>
        <v-btn
          color="primary"
          text
          :to="`/${this.isExpense ? 'expense': 'income'}/${incomeExpense._id}/edit`"
        >
          Edit
        </v-btn>
      </div>
    </v-expand-transition>-->
  </v-card>
</template>

<script>
export default {
  name: "IncomesExpensesTable",
  data () {
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
