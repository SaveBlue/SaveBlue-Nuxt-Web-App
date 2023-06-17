<template>
    <v-app-bar
        color="primary"
    >
      <v-app-bar-nav-icon to="/" icon="mdi-chevron-left"/>

      <v-toolbar-title>Drafts</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs
            v-model="tab"
            grow
            slider-color="accent"
        >
          <v-tab value="e">Expenses</v-tab>
          <v-tab value="i">Incomes</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-window v-model="tab" style="height:100%">

      <!-- Wallet Expenses -->
      <v-window-item value="e">
        <v-container>
          <v-row v-if="loadingExpenses">
            <v-col class="text-center">
              <v-progress-circular size="50" color="primary" indeterminate class="ma-auto py-2"/>
            </v-col>
          </v-row>
          <v-row v-else-if="!expenses.length">
            <v-col>
              <h1 class="text-center">No expenses in drafts</h1>
            </v-col>
          </v-row>
          <v-row v-else class="pt-1" align="center" justify="center">
            <v-col class="py-1" cols="12" v-for="expense in expenses" :key="expense._id">
              <IncomesExpensesTable :isExpense=true :incomeExpense="expense"/>
            </v-col>
            <v-col class="text-center" v-intersect="infiniteScrollingExpenses">
              <v-progress-circular class="py-2 text-center" color="primary" indeterminate v-if="!stopLoadingExpenses"/>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Wallet Incomes -->
      <v-window-item value="i">
        <v-container>
          <v-row v-if="loadingIncomes">
            <v-col class="text-center">
              <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
            </v-col>
          </v-row>
          <v-row v-else-if="!incomes.length">
            <v-col>
              <h1 class="text-center">No incomes in drafts</h1>
            </v-col>
          </v-row>
          <v-row v-else class="pt-1" align="center" justify="center">
            <v-col class="py-1" cols="12" v-for="income in incomes" :key="income._id">
              <IncomesExpensesTable :incomeExpense="income"/>
            </v-col>
            <v-col class="text-center" v-intersect="infiniteScrollingIncomes">
              <v-progress-circular class="py-2" color="primary" indeterminate v-if="!stopLoadingIncomes"/>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>

</template>

<script setup>
definePageMeta({
  layout: "empty",
});
import {ref} from 'vue';
import {storeToRefs} from "pinia";
import {useWalletStore} from '@/stores/wallet';
import {useAuthStore} from '@/stores/auth';

const walletStore = useWalletStore();
const authStore = useAuthStore();

const tab = ref(null);
const incomes = ref([]);
const incomesPageCounter = ref(0);
const stopLoadingIncomes = ref(false);
const loadingIncomes = ref(true);
const expenses = ref([]);
const expensesPageCounter = ref(0);
const stopLoadingExpenses = ref(false);
const loadingExpenses = ref(true);

const {draftsWallet, getLoading: loading} = storeToRefs(walletStore);

walletStore.fetchDraftsWallet();

const config = useRuntimeConfig().public

const loadData = async () => {
  console.log("loadData")
  loadingIncomes.value = true;
  loadingExpenses.value = true;

  //incomes.value = await context.$axios.$get(`/incomes/find/${draftsWallet.value._id}`, {headers: {"x-access-token": context.$auth.strategy.token.get()}});
  const {data: incomesData} = await useFetch(`${config.baseApiUrl}/incomes/find/${draftsWallet.value._id}`, {
    method: "GET",
    headers: {
      "x-access-token": authStore.jwt
    }
  });
  incomes.value = incomesData.value;
  loadingIncomes.value = false;

  //expenses.value = await context.$axios.$get(`/expenses/find/${draftsWallet.value._id}`, {headers: {"x-access-token": context.$auth.strategy.token.get()}});
  const {data: expensesData} = await useFetch(`${config.baseApiUrl}/expenses/find/${draftsWallet.value._id}`, {
    method: "GET",
    headers: {
      "x-access-token": authStore.jwt
    }
  });
  expenses.value = expensesData.value;
  loadingExpenses.value = false;
};

const infiniteScrollingExpenses = async (entries, observer, isIntersecting) => {
  if (isIntersecting && !stopLoadingExpenses.value) {
    expensesPageCounter.value++;
    const {data, error} = await useFetch(`${config.baseApiUrl}/expenses/find/${draftsWallet.value._id}`, {
      method: "GET",
      headers: {
        "x-access-token": authStore.jwt
      },
      params: {page: expensesPageCounter.value}
    });
    if (error){
      console.log(error);
    }
    else {
      if (data.value.length > 0) {
        data.value.forEach(item => expenses.value.push(item));
      } else {
        stopLoadingExpenses.value = true
      }
    }
  }
};

const infiniteScrollingIncomes = async (entries, observer, isIntersecting) => {
  if (isIntersecting && !stopLoadingIncomes.value) {
    incomesPageCounter.value++;
    const {data, error} = await useFetch(`${config.baseApiUrl}/incomes/find/${draftsWallet.value._id}`, {
      method: "GET",
      headers: {
        "x-access-token": authStore.jwt
      },
      params: {page: incomesPageCounter.value}
    });
    if (error) {
      console.log(error);
    } else {
      if (data.value.length > 0) {
        data.value.forEach(item => incomes.value.push(item));
      } else {
        stopLoadingIncomes.value = true
      }
    }
  }
};

watch(() => loading.value, async (newValue, oldValue) => {
      if (oldValue && !newValue) {
        await loadData();
      }
    }
);
</script>

<style scoped>
/* Fixing selected tab invisible in dark mode
.v-tabs-slider-wrapper, .v-tab--active {
  color: #fff !important;
} */

</style>
