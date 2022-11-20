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

      <v-toolbar-title v-if="!loading">{{ account.name }}</v-toolbar-title>

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
          <v-row align="center" justify="center">
            <!-- Overview -->
            <v-col cols="12">
              <AccountOverviewCard :account="account"/>
            </v-col>
            <!-- Analytics -->
            <!-- TODO: make component -->
            <v-card v-if="!account" height="190" class="py-3">
              <v-skeleton-loader type="image" height="100%"/>
            </v-card>
            <v-col v-else cols="12">
              <v-card class="mx-auto text-center">
                <v-card-title class="justify-center">Analytics</v-card-title>
                <v-card-text>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="dateRange"
                    open-on-focus
                  >
                    <template v-slot:activator="{ on, attrs }">

                      <v-combobox
                        append-icon=""
                        v-model="selectedDateRange"
                        item
                        multiple
                        small-chips
                        label="Time Period"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        tabindex="2"

                      />
                    </template>
                    <v-date-picker
                      v-model="selectedDateRange"
                      range
                      scrollable
                      first-day-of-week="1"
                      width="auto"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="modal = false; selectedDateRange = dateRange"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(selectedDateRange)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>


                  <!-- Expense Breakdown -->
                  <IncomeExpenseBreakdown :isExpense="true" :incomeExpenseBreakdown="expenseBreakdown"/>
                  <!-- Income Breakdown -->
                  <IncomeExpenseBreakdown :incomeExpenseBreakdown="incomeBreakdown"/>
                </v-card-text>
              </v-card>
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
            <v-col class="text-center" v-intersect="infiniteScrollingExpenses">
              <v-progress-circular class="py-2 text-center" color="primary" indeterminate v-if="!stopLoadingExpenses"/>
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
            <v-col class="text-center" v-intersect="infiniteScrollingIncomes">
              <v-progress-circular class="py-2" color="primary" indeterminate v-if="!stopLoadingIncomes"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>

    <IncomeExpenseFAB/>
  </div>

</template>

<script>
import {useAccountStore} from '@/store/account'
export default {
  layout: 'empty',
  data() {
    return {
      tab: false,
      startDate: "",
      endDate: "",
      dateRange: ["", ""],
      selectedDateRange: ["", ""],
      //account: {},
      incomes: [],
      incomesPageCounter: 0,
      stopLoadingIncomes: false,
      expenses: [],
      expensesPageCounter: 0,
      stopLoadingExpenses: false,
      expenseBreakdown: [],
      incomeBreakdown: [],
      //loading: true,
      modal: false,
      date: "",
    }
  },
  methods: {
    async getAccount() {
      return this.$axios.$get(
        `/accounts/find/${this.$route.params.id}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      )
    },
    getExpenseBreakdown() {
      return this.$axios.$get(
        `/expenses/breakdown/${this.account._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      )
    },
    getIncomeBreakdown() {
      return this.$axios.$get(
        `/incomes/breakdown/${this.account._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      )
    },
    async setInitialDateRange() {
      let d = new Date(Date.now());
      let start, end;
      end = d.toISOString().split('T')[0];
      (this.account.startOfMonth - d.getDate() > 0) && d.setMonth(d.getMonth() - 1);
      d.setDate(this.account.startOfMonth);
      start = d.toISOString().split('T')[0];
      this.dateRange = [start, end];
      this.selectedDateRange = this.dateRange
    },
    infiniteScrollingExpenses(entries, observer, isIntersecting) {
      if (isIntersecting && !this.stopLoadingExpenses) {
        this.expensesPageCounter++;
        this.$axios.$get(
          `/expenses/find/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}, params: {page: this.expensesPageCounter}}
        ).then(response => {
          //console.log("hi")
          //console.log(response)
          if (response.length > 0) {
            response.forEach(item => this.expenses.push(item));
          } else {
            this.stopLoadingExpenses = true
          }
        })
          .catch(err => {
            console.log(err)
          })
      }
    },
    infiniteScrollingIncomes(entries, observer, isIntersecting) {
      if (isIntersecting && !this.stopLoadingIncomes) {
        this.incomesPageCounter++;
        this.$axios.$get(
          `/incomes/find/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}, params: {page: this.incomesPageCounter}}
        ).then(response => {
          if (response.length > 0) {
            response.forEach(item => this.incomes.push(item));
          } else {
            this.stopLoadingIncomes = true
          }
        })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  computed:{
    account: () => useAccountStore().current,
    loading: () => useAccountStore().loading,
  },
  async fetch() {

    // Account details
    //await this.getAccount().then(async (account) => {
      //this.account = account

      // Set date range
      //await this.setInitialDateRange()

      // Expense breakdown
      /*this.getExpenseBreakdown().then(breakdown => {
        this.expenseBreakdown = breakdown
      })

      // Income breakdown
      this.getIncomeBreakdown().then(breakdown => {
        this.incomeBreakdown = breakdown
      })*/
    //}).finally(() => {
      //this.loading = false
    //});

    // Account incomes
    /*this.incomes = await this.$axios.$get(
      `/incomes/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );*/

    // Account expenses
    /*this.expenses = await this.$axios.$get(
      `/expenses/find/${this.$route.params.id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    );*/
  },
  watch: {
    /*dateRange: function (val) {

      // TODO: make more efficient
      // Order dates
      let start = val[0]
      let end = val[1] ? val[1] : val[0]
      let compare = start.localeCompare(end)
      if (compare > 0) {
        this.startDate = end
        this.endDate = start
      } else {
        this.startDate = start
        this.endDate = end
      }

      // Expense breakdown
      this.getExpenseBreakdown().then(breakdown => {
        this.expenseBreakdown = breakdown
      })

      // Income breakdown
      this.getIncomeBreakdown().then(breakdown => {
        this.incomeBreakdown = breakdown
      })
    }*/
  }
}
</script>

<style scoped>
/* Fixing selected tab invisible in dark mode */
.v-tabs-slider-wrapper, .v-tab--active {
  color: #fff !important;
}

</style>
