<template>
    <v-app>
        <v-navigation-drawer
                :model-value="drawer"
                :rail="rail"
                :permanent="mdAndUp"
        >
            <v-list>
                <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        :to="item.to"
                        exact
                        :prepend-icon="item.icon"
                        :title="item.title"
                >
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
                color="primary"
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"/>
            <v-toolbar-title>SaveBlue</v-toolbar-title>
            <v-spacer/>
            <!--<v-btn v-show="$auth.loggedIn" icon @click="$auth.logout()">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>-->
        </v-app-bar>
        <v-main>
            <slot/>
        </v-main>

        <!-- FAB -->
        <IncomeExpenseFAB/>

        <!-- Footer -->
        <Footer/>

        <!-- Snackbar -->
        <AppSnackbar/>

    </v-app>
</template>

<script setup>
import {useDisplay} from 'vuetify'
import {useTheme} from 'vuetify'
import {useWalletStore} from "~/stores/wallet";
import {useSnackbarStore} from "~/stores/snackbar";

const nuxtApp = useNuxtApp();
const theme = useTheme()
const {mdAndUp} = useDisplay()

const walletStore = useWalletStore()
const snackbarStore = useSnackbarStore()
const { fetchWallets } = walletStore
fetchWallets(nuxtApp);
const { displayError } = snackbarStore

onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})

const fab = ref(false)
const drawer = ref(false)
const rail = ref(false)

const items = [
    {
        icon: 'mdi-view-dashboard',
        title: 'Dashboard',
        to: '/'
    },
    {
        icon: 'mdi-credit-card-sync',
        title: 'Drafts',
        to: '/drafts'
    },
    {
        icon: 'mdi-account',
        title: 'Profile',
        to: '/profile'
    },
    {
        icon: 'mdi-cog',
        title: 'Settings',
        to: '/settings'
    }
]
</script>

<style scoped>

</style>