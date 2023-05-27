<template>
    <v-app dark>
        <v-navigation-drawer
                v-model="drawer"
                :mini-variant="miniVariant"
                :clipped="clipped"
                fixed
                app
                :permanent="mdAndUp"
        >
            <v-list>
                <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        :to="item.to"
                        router
                        exact
                >
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>

                    <v-list-item-title v-text="item.title"/>

                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
                :clipped-left="clipped"
                fixed
                app
                dark
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
        <!--<IncomeExpenseFAB/>-->

        <!-- Footer -->
        <!--<Footer/>-->

        <!-- Snackbar -->
        <!--<AppSnackbar/>-->

    </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import colors from 'vuetify/lib/util/colors'
import { useTheme } from 'vuetify'

/*import {useWalletStore} from "~/stores/wallet";
const walletStore = useWalletStore()
walletStore.fetchWallets()*/

const { mdAndUp } = useDisplay()
const theme = useTheme()

onMounted(() => {

    console.log(colors.blue)

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }

})

const fab = ref(false)
const clipped = ref(false)
const drawer = ref(false)
const fixed = ref(false)
const miniVariant = ref(false)

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