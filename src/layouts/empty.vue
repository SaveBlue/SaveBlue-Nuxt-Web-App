<template>
    <v-app dark>
        <v-main>
            <slot style="height: 100%"/>
            <AppSnackbar/>
        </v-main>
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'
import {useWalletStore} from "~/stores/wallet";
import {useCategoryStore} from "~/stores/category";

const nuxtApp = useNuxtApp();
const theme = useTheme()

const walletStore = useWalletStore()
const { fetchWallets, fetchCurrent } = walletStore;
fetchWallets(nuxtApp);
fetchCurrent(nuxtApp);

const categoryStore = useCategoryStore()
const { fetchExpense, fetchIncome } = categoryStore;
fetchExpense();
fetchIncome();


onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})
</script>

<style scoped>

</style>