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
import {useContext} from "@nuxtjs/composition-api";
import {useCategoryStore} from "@/store/category";

export default {
  name: "empty",

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
