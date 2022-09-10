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
          <v-tab>Incomes</v-tab>
          <v-tab>Expenses</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="tab" style="height:100%">
      <!-- Account Overview -->
      <v-tab-item>
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-card v-if="loading" height="190">
                <v-skeleton-loader type="image" height="100%"/>
              </v-card>
              <AccountOverviewCard v-else :account="account"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <!-- Account Incomes -->
      <v-tab-item>
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12" v-for="income in incomes" :key="income._id">
              <IncomesExpensesTable :incomeExpense="income" />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <!-- Account Expenses -->
      <v-tab-item>
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-row align="center" justify="center">
                <v-col cols="12" v-for="expense in expenses" :key="expense._id">
                  <IncomesExpensesTable :incomeExpense="expense" :isExpense=true />
                </v-col>
              </v-row>
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
      account: {},
      incomes: [],
      expenses: [],
      loading: true
    }
  },
  async fetch() {
    this.account = await this.$axios.$get(
      `/accounts/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    ).finally(() => this.loading = false);
    this.incomes = await this.$axios.$get(
      `/incomes/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );
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
