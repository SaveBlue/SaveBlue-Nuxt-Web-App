<template>
  <div>
    <v-app-bar
      fixed
      color="primary"
      dark
      app
    >
      <v-app-bar-nav-icon to="/">
        <v-icon>mdi-chevron-left</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ account.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon to="edit" append>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          fixed-tabs
        >
          <v-tabs-slider color="accent"></v-tabs-slider>
          <v-tab>Overview</v-tab>
          <v-tab>Expenses</v-tab>
          <v-tab>Incomes</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab" style="height:100%">
      <!-- Account Overview -->
      <v-tab-item>
        <v-container>
          <!-- Loaders -->
          <v-row align="center" justify="center">
            <v-col v-if="loading" cols="12">
              <v-card height="190" class="py-3">
                <v-skeleton-loader type="image" height="100%"/>
              </v-card>
              <v-card height="190" class="py-3">
                <v-skeleton-loader type="image" height="100%"/>
              </v-card>
            </v-col>
            <!-- Overview -->
            <v-col v-else cols="12">
              <AccountOverviewCard :account="account"/>
            </v-col>
            <!-- Expense Breakdown -->
            <v-col cols="12">
              <IncomeExpenseBreakdown :isExpense="true" :incomeExpenseBreakdown="expenseBreakdown"/>
            </v-col>
            <!-- Income Breakdown -->
            <v-col cols="12">
              <IncomeExpenseBreakdown :incomeExpenseBreakdown="incomeBreakdown"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <!-- Account Expenses -->
      <v-tab-item>
        <v-container>
          <v-row class="pt-1" align="center" justify="center">
            <v-col class="py-1" cols="12" v-for="expense in expenses" :key="expense._id">
              <IncomesExpensesTable :isExpense=true :incomeExpense="expense"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <!-- Account Incomes -->
      <v-tab-item>
        <v-container>
          <v-row class="pt-1" align="center" justify="center">
            <v-col class="py-1" cols="12" v-for="income in incomes" :key="income._id">
              <IncomesExpensesTable :incomeExpense="income"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>

    <IncomeExpenseFAB/>
  </div>

</template>

<script>
export default {
  name: "account",
  layout: 'empty',
  data() {
    return {
      tab: false,
      startDate: "",
      endDate: "",
      account: {},
      incomes: [],
      expenses: [],
      expenseBreakdown: [],
      incomeBreakdown: [],
      loading: true
    }
  },
  async fetch() {

    // Account details
    await this.$axios.$get(
      `/accounts/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    ).then(async (account) => {
      this.account = account

      // Set date range
      let d = new Date(Date.now());
      this.endDate = d.toISOString().split('T')[0];
      (this.account.startOfMonth - d.getDate() > 0) && d.setMonth(d.getMonth() - 1);
      d.setDate(this.account.startOfMonth);
      this.startDate = d.toISOString().split('T')[0];

      // Expense breakdown
      this.$axios.$get(
        `/expenses/breakdown/${this.account._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      ).then(breakdown => {
        this.expenseBreakdown = breakdown
      })

      // Income breakdown
      this.$axios.$get(
        `/incomes/breakdown/${this.account._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      ).then(breakdown => {
        this.incomeBreakdown = breakdown
      })
    }).finally(() => {
      this.loading = false
    });

    // Account incomes
    this.incomes = await this.$axios.$get(
      `/incomes/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );

    // Account expenses
    this.expenses = await this.$axios.$get(
      `/expenses/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );
  }
}
</script>

<style scoped>
/* Fixing selected tab invisible in dark mode */
.v-tabs-slider-wrapper, .v-tab--active {
  color: #fff !important;
}

</style>
