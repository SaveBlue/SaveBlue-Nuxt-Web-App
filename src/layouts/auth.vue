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
const theme = useTheme()

onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})
</script>

<style scoped>

</style>