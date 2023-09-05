<template>

  <!-- Loader -->
    <v-card v-if="loading" height="190" class="py-3">
        <v-skeleton-loader type="image" height="100%"/>
    </v-card>

  <!-- Content -->
    <v-card v-else class="mx-auto text-center">

        <v-card-title class="justify-center">Analytics</v-card-title>

        <v-card-text>
            <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="dateRange"
                    open-on-focus
            >
                <!--                <template v-slot:activator="{ on, attrs }">-->

                <!--                    <v-combobox-->
                <!--                            append-icon=""-->
                <!--                            v-model="selectedDateRange"-->
                <!--                            item-->
                <!--                            multiple-->
                <!--                            small-chips-->
                <!--                            label="Time Period"-->
                <!--                            prepend-inner-icon="mdi-calendar"-->
                <!--                            readonly-->
                <!--                            v-bind="attrs"-->
                <!--                            v-on="on"-->
                <!--                            dense-->
                <!--                            tabindex="2"-->

                <!--                    />-->
                <!--                </template>-->
                <!--                <v-date-picker-->
                <!--                        v-model="selectedDateRange"-->
                <!--                        range-->
                <!--                        scrollable-->
                <!--                        first-day-of-week="1"-->
                <!--                        width="auto"-->
                <!--                >-->
                <v-spacer></v-spacer>
                <v-btn
                        variant="text"
                        color="primary"
                        @click="modal = false; selectedDateRange = dateRange"
                >
                    Cancel
                </v-btn>
                <v-btn
                        variant="text"
                        color="primary"
                        @click="modal = false; $refs.dialog.save(selectedDateRange)"
                >
                    OK
                </v-btn>
            </v-dialog>

            <!--Expense Breakdown-->
            <IncomeExpenseBreakdown v-if="showGraphs" :isExpense="true"
                                    :incomeExpenseBreakdown="dataExpenses.expenses"/>
            {{ dataExpenses.expenses }}
            <!-- Income Breakdown -->
            <IncomeExpenseBreakdown v-if="showGraphs" :incomeExpenseBreakdown="dataIncomes.incomes"/>
            {{ dataIncomes.incomes }}

        </v-card-text>
    </v-card>
</template>

<script setup>
import {VSkeletonLoader} from 'vuetify/labs/VSkeletonLoader'
import {useWalletStore} from "~/stores/wallet";
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";

// Data properties
const dateRange = ref(["", ""]);
const selectedDateRange = ref(["", ""]);
const modal = ref(false);
const showGraphs = ref(false);
const startDate = ref("");
const endDate = ref("");

const walletStore = useWalletStore()
const authStore = useAuthStore();
const {fetchCurrent} = walletStore;
const {getLoading: loading, current: wallet} = storeToRefs(walletStore);
const config = useRuntimeConfig().public
const route = useRoute()

// only fetch if wallet is not loaded or if the loaded wallet is not the current one
if (!!!wallet.value || wallet.value._id !== route.params.idW) {
    await fetchCurrent()
}

const dataIncomes = ref({
    incomes: [],
    stopLoadingIncomes: false,
})
const dataExpenses = ref({
    expenses: [],
    stopLoadingExpenses: false,
})

// Methods
//------------------------------------------------
const loadData = async () => {
    await Promise.all([inRefresh(), exRefresh()])

    dataIncomes.value.incomes = inData.value
    dataExpenses.value.expenses = exData.value
}
const urlIncomes = `${config.baseApiUrl}/incomes/breakdown/${wallet.value._id}`
const {data: inData, refresh: inRefresh} = await useAsyncData(urlIncomes,
    () => $fetch(urlIncomes, {
        method: "GET",
        headers: {
            "x-access-token": authStore.jwt
        },
        query: {startDate: startDate.value, endDate: endDate.value},
    }),
    {immediate: false}
)

const urlExpenses = `${config.baseApiUrl}/expenses/breakdown/${wallet.value._id}`
console.log(urlExpenses)
const {data: exData, refresh: exRefresh} = await useAsyncData(urlExpenses,
    () => $fetch(urlExpenses, {
        method: "GET",
        headers: {
            "x-access-token": authStore.jwt
        },
        query: {startDate: startDate.value, endDate: endDate.value},
    }),
    {immediate: false}
)

async function setInitialDateRange() {
    let d = new Date(Date.now());
    let start, end;
    end = d.toISOString().split('T')[0];
    (wallet.value.startOfMonth - d.getDate() > 0) && d.setMonth(d.getMonth() - 1);
    d.setDate(wallet.value.startOfMonth);
    start = d.toISOString().split('T')[0];
    dateRange.value = [start, end];
    selectedDateRange.value = dateRange.value;
}

await setInitialDateRange()

watch(() => dateRange, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        console.log('change')
        showGraphs.value = false;
        let start = newVal[0];
        let end = newVal[1] ? newVal[1] : newVal[0];
        let compare = start.localeCompare(end);

        if (compare > 0) {
            startDate.value = end;
            endDate.value = start;
        } else {
            startDate.value = start;
            endDate.value = end;
        }

        await loadData()
        showGraphs.value = true;
    }
}, {deep: true})

// TODO remove debug
dateRange.value[0] = '2023-05-01'
startDate.value = dateRange.value[0];
endDate.value = dateRange.value[1];
console.log(dateRange.value)
await loadData()
console.log(dataExpenses.value.expenses)

</script>


<style scoped>

</style>
