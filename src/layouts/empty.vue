<template>
  <VitePwaManifest/>
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
import {storeToRefs} from "pinia";

const theme = useTheme()

const { fetchWallets} = useWalletStore();
const { fetchExpense, fetchIncome } = useCategoryStore();

await Promise.all([fetchWallets(), fetchExpense(), fetchIncome()])


onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})
</script>

<style scoped>

</style>