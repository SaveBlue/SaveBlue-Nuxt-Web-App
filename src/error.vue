<template>
    <v-container class="text-center content">
        <v-row justify="center" align="center">
            <v-col class="text-h1 myFont">
                {{ error.statusCode }}
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-h5 myFont">
                {{ error.message }}
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn variant="plain" @click="handleClearError" color="primary" class="myFont"> Return to Dashboard</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import {useTheme} from 'vuetify'

const props = defineProps(['error'])
const theme = useTheme()

const handleClearError = () => {
    clearError({redirect: '/'})
}

onMounted(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme.global.name.value = 'themeDark'
    }
})
</script>

<style scoped>
.content {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>