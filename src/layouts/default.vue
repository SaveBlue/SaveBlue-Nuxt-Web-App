<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      :permanent="$vuetify.breakpoint.mdAndUp"
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
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
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
      <v-spacer />
      <v-btn v-show="$auth.loggedIn" icon @click="$auth.logout()">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
        <Nuxt />
    </v-main>

    <!-- FAB -->
    <IncomeExpenseFAB/>

    <!-- Footer -->
    <Footer/>

    <!-- Snackbar -->
    <AppSnackbar/>

  </v-app>
</template>

<script>
import {useWalletStore} from "@/store/wallet";
import {useContext} from "@nuxtjs/composition-api";

export default {
  name: 'DefaultLayout',
  setup(){
    const context = useContext()
    const walletStore = useWalletStore()

    walletStore.fetchWallets(context)
    walletStore.fetchWallets(context, true)
    return {}
  },
  data () {
    return {
      fab: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
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
          icon: 'mdi-archive',
          title: 'Archived',
          to: '/archived'
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
      ],
      miniVariant: false,
    }
  },
  mounted() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.$vuetify.theme.dark = true;
    }
  }
}
</script>
