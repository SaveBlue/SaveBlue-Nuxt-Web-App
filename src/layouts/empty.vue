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
import {useCategoryStore} from "@/store/category";

export default {
  name: "empty",
  setup(){
    const context = useContext()
    const accountStore = useAccountStore()
    const categoryStore = useCategoryStore()

    accountStore.fetchAccounts(context)
    accountStore.fetchCurrent(context)
    categoryStore.fetchExpense()
    categoryStore.fetchIncome()
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
