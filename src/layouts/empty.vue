<template>
    <v-app dark>
        <v-main>
            <slot style="height: 100%"/>
            <!--<AppSnackbar/>-->
        </v-main>
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme()

/*import {useWalletStore} from "~/stores/wallet";
const walletStore = useWalletStore()
walletStore.fetchWallets()*/

onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})
</script>

<style scoped>

</style>