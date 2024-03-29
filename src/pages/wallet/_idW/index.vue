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

      <v-toolbar-title v-if="!loading">{{ wallet.name }}</v-toolbar-title>

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
      <!-- Wallet Overview -->
      <v-tab-item>
        <v-container>
          <v-row align="center" justify="center">
            <!-- Overview -->
            <v-col cols="12">
              <WalletOverviewCard/>
            </v-col>
            <!-- Analytics -->
            <v-col cols="12">
              <!-- TODO: fix -->
              <AnalyticsCard v-if="!loading"/>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <!-- Wallet Expenses -->
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

      <!-- Wallet Incomes -->
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
import {useWalletStore} from '@/store/wallet'
export default {
  layout: 'empty',
  data() {
    return {
      tab: false,
      incomes: [],
      incomesPageCounter: 0,
      stopLoadingIncomes: false,
      expenses: [],
      expensesPageCounter: 0,
      stopLoadingExpenses: false,
    }
  },
  methods: {
    async loadData(){
      // Wallet incomes
      this.incomes = await this.$axios.$get(
        `/incomes/find/${this.$route.params.idW}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      );

      // Wallet expenses
      this.expenses = await this.$axios.$get(
        `/expenses/find/${this.$route.params.idW}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      )
    },
    infiniteScrollingExpenses(entries, observer, isIntersecting) {
      if (isIntersecting && !this.stopLoadingExpenses) {
        this.expensesPageCounter++;
        this.$axios.$get(
          `/expenses/find/${this.$route.params.idW}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}, params: {page: this.expensesPageCounter}}
        ).then(response => {
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
          `/incomes/find/${this.$route.params.idW}`,
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
    wallet: () => useWalletStore().current,
    loading: () => useWalletStore().getLoading,
  },
  async mounted() {
    // Change route
    if (!this.loading){
      await this.loadData()
    }
  },
  watch:{
    // Refresh page
    async loading(newValue, oldValue){
      if(oldValue && !newValue){
        await this.loadData()
      }
    }
  }
}
</script>

<style scoped>
/* Fixing selected tab invisible in dark mode */
.v-tabs-slider-wrapper, .v-tab--active {
  color: #fff !important;
}

</style>
