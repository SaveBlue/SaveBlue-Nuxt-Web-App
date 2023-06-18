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
            {{ dataExpenses }}
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
            {{ dataIncomes }}
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

definePageMeta({layout: 'empty'})

const walletStore = useWalletStore()
const {getLoading, current: wallet} = storeToRefs(walletStore);
const authStore = useAuthStore();
const config = useRuntimeConfig().public

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

onMounted(async () => {
    if (!getLoading.value) {
        console.log("mounted")
        await loadDataExpenses();
        await loadDataIncomes();
    }
})

watch(() => getLoading.value, async (newValue, oldValue) => {
        if (oldValue && !newValue) {
            await loadDataExpenses();
            await loadDataIncomes();
        }
    }
);

// methods
// --------------------

const loadDataIncomes = () => {
    return new Promise(async (resolve) => {

        const {data: inData} = await useFetch(`${config.baseApiUrl}/incomes/find/${wallet.value._id}`, {
            method: "GET",
            headers: {
                "x-access-token": authStore.jwt
            }
        });

        dataIncomes.value.incomes = inData.value;
        dataIncomes.value.stopLoadingIncomes = true;

        resolve();

    });
};
const loadDataExpenses = async () => {
    return new Promise(async (resolve) => {
        const {data: exData} = await useFetch(`${config.baseApiUrl}/expenses/find/${wallet.value._id}`, {
            method: "GET",
            headers: {
                "x-access-token": authStore.jwt
            }
        })
        dataExpenses.value.expenses = exData.value;
        dataExpenses.value.stopLoadingExpenses = true;
        resolve();
    });
}

const infiniteScrollingExpenses = async (entries, observer, isIntersecting) => {

    if (isIntersecting && !dataExpenses.value.stopLoadingExpenses) {
        dataExpenses.value.expensesPageCounter++;

        const {data, error} = await useFetch(`${config.baseApiUrl}/expenses/find/${wallet.value._id}`, {
            method: "GET",
            headers: {
                "x-access-token": authStore.jwt

            },
            params: {page: dataExpenses.value.expensesPageCounter}
        });
        dataExpenses.value.expenses = data.value;
        dataExpenses.value.stopLoadingExpenses = true;

        if (error) {
            console.log(error);
        } else {
            if (data.value.length > 0) {
                data.value.forEach(item => dataExpenses.value.expenses.push(item));
            } else {
                dataExpenses.value.stopLoadingExpenses = true
            }
        }
    }
}
const infiniteScrollingIncomes = async (entries, observer, isIntersecting) => {

    if (isIntersecting && !dataIncomes.value.stopLoadingIncomes) {
        dataIncomes.value.incomesPageCounter++;

        const {data, error} = await useFetch(`${config.baseApiUrl}/incomes/find/${wallet.value._id}`, {
            method: "GET",
            headers: {
                "x-access-token": authStore.jwt

            },
            params: {page: dataIncomes.value.incomesPageCounter}
        });
        dataIncomes.value.incomes = data.value;
        dataIncomes.value.stopLoadingIncomes = true;

        if (error) {
            console.log(error);
        } else {
            if (data.value.length > 0) {
                data.value.forEach(item => dataIncomes.value.incomes.push(item));
            } else {
                dataIncomes.value.stopLoadingIncomes = true
            }
        }
    }
}
</script>

<style scoped>

</style>