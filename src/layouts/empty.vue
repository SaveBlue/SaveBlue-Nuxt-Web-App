<template>
  <v-app dark>
    <v-main>
      <Nuxt style="height: 100%"/>
      <AppSnackbar/>
    </v-main>
  </v-app>
</template>

<script>
import {useAccountStore} from "@/store/account";
import {useContext} from "@nuxtjs/composition-api";

export default {
  name: "empty",
  setup(){
    const context = useContext()
    const accountStore = useAccountStore()

    accountStore.fetchAccounts(context)
    return {}
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

<style scoped>

</style>
