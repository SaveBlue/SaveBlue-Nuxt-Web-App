<template>

    <v-app-bar
            fixed
            color="primary"
            dark
            app
    >
        <v-app-bar-nav-icon to="/">
            <v-icon>mdi-chevron-left</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title v-if="!getLoading">{{ wallet.name }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon to="edit" append>
            <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <template v-slot:extension>
            <v-tabs
                    v-model="tab"
                    fixed-tabs
                    slider-color="accent"
            >
                <v-tab>Overview</v-tab>
                <v-tab>Expenses</v-tab>
                <v-tab>Incomes</v-tab>
            </v-tabs>
        </template>
    </v-app-bar>

    <v-window v-model="tab" style="height:100%">
        <!-- Wallet Overview -->
        <v-window-item>
            <v-container>
                <v-row align="center" justify="center">
                    <!-- Overview -->
                    <v-col cols="12">
                        <WalletOverviewCard/>
                    </v-col>
                    <!-- Analytics -->
                    <v-col cols="12">
                        <!-- TODO: fix -->
                        <!--<AnalyticsCard v-if="!getLoading"/>-->
                    </v-col>
                </v-row>
            </v-container>
        </v-window-item>

        <!-- Wallet Expenses -->
        <v-window-item>
            <v-container>
                <v-row class="pt-1" align="center" justify="center">
                    <v-col class="py-1" cols="12" v-for="expense in dataExpenses.expenses" :key="expense._id">
                        <IncomesExpensesTable :isExpense=true :incomeExpense="expense"/>
                    </v-col>
                    <v-col class="text-center" v-intersect="infiniteScrollingExpenses">
                        <v-progress-circular class="py-2 text-center" color="primary" indeterminate
                                             v-if="!dataExpenses.stopLoadingExpenses"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-window-item>

        <v-window-item>
            <v-container>
                <v-row class="pt-1" align="center" justify="center">
                    <v-col class="py-1" cols="12" v-for="income in dataIncomes.incomes" :key="income._id">
                        <IncomesExpensesTable :incomeExpense="income"/>
                    </v-col>
                    <v-col class="text-center" v-intersect="infiniteScrollingIncomes">
                        <v-progress-circular class="py-2" color="primary" indeterminate
                                             v-if="!dataIncomes.stopLoadingIncomes"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-window-item>


    </v-window>

</template>

<script setup>
import {useWalletStore} from "~/stores/wallet";
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";
import {useFetch} from "#app";

definePageMeta({layout: 'empty'})

const walletStore = useWalletStore()
const {getLoading, current: wallet} = storeToRefs(walletStore);
const authStore = useAuthStore();
const config = useRuntimeConfig().public

const {fetchCurrent} = walletStore;
// only fetch if wallet is not loaded or if the loaded wallet is not the current one
if (!!!wallet.value || wallet.value._id !== useRoute().params.idW) {
    await fetchCurrent()
}

const tab = ref(0)
const dataIncomes = ref({
    incomes: [],
    incomesPageCounter: 0,
    stopLoadingIncomes: false,
})
const dataExpenses = ref({
    expenses: [],
    expensesPageCounter: 0,
    stopLoadingExpenses: false,
})

watch(() => getLoading.value, (newValue, oldValue) => {
        if (oldValue && !newValue) {
            loadData();
        }
    }
);

const loadData = async () => {
    await Promise.all([inRefresh(), exRefresh()])

    dataIncomes.value.incomes = inData.value
    dataExpenses.value.expenses = exData.value
}

const urlIncomes = `${config.baseApiUrl}/incomes/find/${wallet.value._id}`
const {data: inData, refresh: inRefresh} = await useAsyncData(urlIncomes,
    () => $fetch(urlIncomes, {
        method: "GET",
        headers: {
            "x-access-token": authStore.jwt
        },
        query: {page: dataIncomes.value.incomesPageCounter},
    }),
    {immediate: false}
)

const urlExpenses = `${config.baseApiUrl}/expenses/find/${wallet.value._id}`
const {data: exData, refresh: exRefresh} = await useAsyncData(urlExpenses,
    () => $fetch(urlExpenses, {
        method: "GET",
        headers: {
            "x-access-token": authStore.jwt
        },
        query: {page: dataExpenses.value.expensesPageCounter},
    }),
    {immediate: false}
)

await loadData()


// methods
// --------------------

const infiniteScrollingExpenses = async (isIntersecting) => {

    if (isIntersecting && !dataExpenses.value.stopLoadingExpenses) {
        dataExpenses.value.expensesPageCounter++;

        await exRefresh()

        dataExpenses.value.expenses.push(...exData.value)

        if (exData.value.length <= 0) {
            dataExpenses.value.stopLoadingExpenses = true
        }
    }
}
const infiniteScrollingIncomes = async (isIntersecting) => {

    if (isIntersecting && !dataIncomes.value.stopLoadingIncomes) {
        dataIncomes.value.incomesPageCounter++;

        await inRefresh()

        dataIncomes.value.incomes.push(...inData.value)

        if (inData.value.length <= 0) {
            dataIncomes.value.stopLoadingIncomes = true
        }
    }
}
</script>

<style scoped>

</style>