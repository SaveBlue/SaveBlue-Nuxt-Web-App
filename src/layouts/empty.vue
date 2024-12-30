<template>
  <v-app dark>
    <v-main>
      <Nuxt style="height: 100%"/>
      <AppSnackbar/>
    </v-main>
  </v-app>
</template>

<script>
import {useWalletStore} from "@/store/wallet";
import {useContext, useRoute, watch} from "@nuxtjs/composition-api";
import {useCategoryStore} from "@/store/category";

export default {
  name: "empty",
  setup(){
    const context = useContext()
    const walletStore = useWalletStore()
    const categoryStore = useCategoryStore()
    const route = useRoute();

    walletStore.fetchWallets(context)
    walletStore.fetchWallets(context,true)
    walletStore.fetchCurrent(context)
    categoryStore.fetchExpense()
    categoryStore.fetchIncome()

    watch(
      () => route.value.fullPath,
      (newPath) => {
        if (newPath.startsWith('/wallet')) {
          walletStore.fetchCurrent(context);
        }
      }
    );

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
