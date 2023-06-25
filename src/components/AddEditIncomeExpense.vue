<template>

  <!-- Loader -->
    <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
        <v-col cols="2">
            <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
        </v-col>
    </v-row>

  <!-- Content -->
    <div v-else>
        <v-app-bar
                fixed
                color="primary"
                dark
                app
        >
            <v-app-bar-nav-icon @click="router.back()">
                <v-icon>mdi-close</v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title>
                <span v-if="edit">Edit</span>
                <span v-else>Add</span>
                <span v-if="isExpense">Expense</span>
                <span v-else>Income</span>
            </v-toolbar-title>

        </v-app-bar>
        <v-container>
            <v-card>
                <v-card-text>
                    <v-form ref="inputForm" v-model="valid">
                        <!-- TODO: fix
                        <v-currency-field
                                v-model="incomeExpense.amount"
                                :rules="applyRules ? amountRules : []"
                                label="Amount"
                                prepend-icon="mdi-currency-eur"
                                required
                                suffix="€"
                        />-->
                        <v-text-field
                                v-model="incomeExpense.amount"
                                :rules="applyRules ? amountRules : []"
                                label="Amount"
                                prepend-icon="mdi-currency-eur"
                                required
                                suffix="€"
                                variant="underlined"
                        />
                        <div v-if="isExpense">
                            <v-select
                                    v-model="incomeExpense.category1"
                                    :items="categoriesExpense.map(c => c.category1)"
                                    label="Primary Category"
                                    prepend-icon="mdi-numeric-1-circle-outline"
                                    :rules="requiredRules"
                                    required
                                    variant="underlined"
                            ></v-select>
                            <v-select
                                    v-if="isExpense"
                                    v-model="incomeExpense.category2"
                                    :disabled="!incomeExpense.category1"
                                    :items="incomeExpense.category1 ? categoriesExpense.filter(c => c.category1 === incomeExpense.category1)[0].category2 : []"
                                    label="Secondary Category"
                                    prepend-icon="mdi-numeric-2-circle-outline"
                                    :rules="requiredRules"
                                    required
                                    variant="underlined"
                            />
                        </div>
                        <div v-else>
                            <v-select
                                    v-model="incomeExpense.category1"
                                    :items="categoriesIncome.map(c => c.category1)"
                                    label="Primary Category"
                                    prepend-icon="mdi-numeric-1-circle-outline"
                                    :rules="requiredRules"
                                    required
                                    variant="underlined"
                            ></v-select>
                        </div>
                        <v-text-field
                                v-model="incomeExpense.description"
                                :counter="32"
                                label="Description"
                                prepend-icon="mdi-text"
                                :rules="descriptionRules"
                                variant="underlined"
                        />

                        <v-text-field
                                v-model="incomeExpense.date"
                                label="Date"
                                prepend-icon="mdi-calendar"
                                variant="underlined"
                                type="date"
                        />

                        <v-select
                                v-model="incomeExpense.wallet"
                                :items="wallets"
                                item-title="name"
                                item-value="_id"
                                label="Wallet"
                                prepend-icon="mdi-wallet"
                                :rules="requiredRules"
                                variant="underlined"
                        ></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="edit" color="primary" @click="updateIncomeExpense">
                        <span>Update</span>
                        <span v-if="isExpense">&nbspExpense</span>
                        <span v-else>&nbspIncome</span>
                    </v-btn>
                    <v-btn v-else color="primary" @click="createIncomeExpense">
                        <span>Add</span>
                        <span v-if="isExpense">&nbspExpense</span>
                        <span v-else>&nbspIncome</span>
                    </v-btn>
                </v-card-actions>
                <v-card-actions v-show="edit">
                    <v-btn color="error" @click="deleteIncomeExpense">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </div>
</template>

<script setup>

import {useWalletStore} from "~/stores/wallet";
import {storeToRefs} from "pinia";
import {useAuthStore} from "~/stores/auth";
import {useSnackbarStore} from "~/stores/snackbar";
import {useCategoryStore} from "~/stores/category";
import {VDatePicker} from 'vuetify/labs/VDatePicker'
import {navigateTo} from "#app";

const route = useRoute()
const router = useRouter()

const walletStore = useWalletStore()
const snackbar = useSnackbarStore()
const {getLoading, current, wallets} = storeToRefs(walletStore);
const authStore = useAuthStore();
const {income: categoriesIncome, expense: categoriesExpense, getLoading: loading} = storeToRefs(useCategoryStore());
const config = useRuntimeConfig().public

const props = defineProps({
    edit: Boolean,
    isExpense: {
        type: Boolean,
        default: false
    }
})

const modal = ref(false);
const valid = ref(false);
const inputForm = ref(null)

const incomeExpense = ref({
    amount: 0,
    category1: "",
    category2: "",
    description: "",
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
    wallet: "",
    userID: null,
    accountID: null,
});

const applyRules = ref(false)

const requiredRules = [
    v => !!v || "Required Field",
]
const amountRules = [
    v => !!v || "Required Field",
    //v => +(v.toString().replaceAll(".","").replaceAll(",",".")) > 0  || "Amount must be bigger than 0",
    //v => !!v && +(v.toString().replaceAll(".","").replaceAll(",",".")) < 1000000 || "Number too big",
]
const descriptionRules = [
    v => v.length <= 32 || "Description too long."
]

const {
    data,
    execute
} = await useFetch(`${config.baseApiUrl}/${props.isExpense ? 'expenses' : 'incomes'}/${route.params.id}`, {
    method: "GET",
    headers: {
        "x-access-token": authStore.jwt
    },
    immediate: false,
})


// methods
// ----------------------------------

const loadData = async () => {
    if (props.edit) {
        applyRules.value = false

        await execute()

        incomeExpense.value = data.value

        if (incomeExpense.value.category1 === "Draft") {
            incomeExpense.value.category1 = "";
            (incomeExpense.value.category2) && (incomeExpense.value.category2 = "")
        }

        const walletFromList = wallets.value.find((w) => w._id === incomeExpense.value.accountID)
        incomeExpense.value.wallet = walletFromList ? walletFromList._id : ""
        incomeExpense.value.date = incomeExpense.value.date.split("T")[0]
        applyRules.value = true

    } else {
        (typeof current.value !== "undefined") && (incomeExpense.value.wallet = current.value.name)
    }
}

await loadData()
const createIncomeExpense = async () => {

    const {valid} = await inputForm.value.validate()
    console.table(incomeExpense.value)
    if (valid) {
        try {
            // required for server
            incomeExpense.value.amount = parseInt(incomeExpense.value.amount)
            incomeExpense.value.userID = authStore.user._id
            incomeExpense.value.accountID = incomeExpense.value.wallet


            await $fetch(`${config.baseApiUrl}/${props.isExpense ? 'expenses' : 'incomes'}/`, {
                method: 'POST',
                headers: {
                    "x-access-token": authStore.jwt
                },
                body: incomeExpense.value
            });

            snackbar.displayPrimary("Created successfully")
            navigateTo("/")

        } catch (e) {
            snackbar.displayError("Error while creating")
        }
    }
}

const deleteIncomeExpense = async () => {
    try {
        await $fetch(`${config.baseApiUrl}/${props.isExpense ? 'expenses' : 'incomes'}/${route.params.id}`, {
            method: 'DELETE',
            headers: {
                "x-access-token": authStore.jwt
            },
        });

        snackbar.displayPrimary("Delete successful")
        router.back()
    } catch (e) {
        snackbar.displayError("Error deleting");
    }
}

const updateIncomeExpense = async () => {

    const {valid} = await inputForm.value.validate()

    if (valid) {
        try {
            // required for server
            incomeExpense.value.amount = parseInt(incomeExpense.value.amount)
            incomeExpense.value.accountID = incomeExpense.value.wallet

            await $fetch(`${config.baseApiUrl}/${props.isExpense ? 'expenses' : 'incomes'}/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    "x-access-token": authStore.jwt
                },
                body: incomeExpense.value
            });

            snackbar.displayPrimary("Update successfully")
            router.back()
        } catch (e) {
            snackbar.displayError("Error while updating")
        }
    }
}

</script>

<style scoped>

</style>