<template>
    <v-container>
        <v-row style="height: 100vh" align="center" justify="center">
            <v-card width="400" class="ma-3" elevation="12">
                <v-toolbar color="primary">
                    <v-avatar size="50" class="my-3 mr-3 ml-3 rounded-circle" image="logo.png"/>
                    <h1>Login</h1>
                </v-toolbar>
                <v-card-text>
                    <v-form ref="form" @submit.prevent="userLogin">
                        <v-text-field
                                v-model="username"
                                variant="underlined"
                                color="primary"
                                label="Username"
                                prepend-icon="mdi-account-circle"
                                :disabled="loading"
                        />
                        <v-text-field
                                v-model="password"
                                variant="underlined"
                                color="primary"
                                :type="showPassword ? 'text' : 'password'"
                                label="Password"
                                prepend-icon="mdi-lock"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword"
                                autocomplete="on"
                                :disabled="loading"
                        />
                        <div class="d-flex justify-space-between">
                            <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Login</v-btn>
                            <v-btn color="primary" variant="text" to="register" :disabled="loading">Register</v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script setup>
import {ref, reactive} from 'vue';
import {useSnackbarStore} from "~/stores/snackbar";
import {useAuthStore} from "~/stores/auth";

//const form = reactive({ username: '', password: '' });
const router = useRouter()
const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const snackbar = useSnackbarStore();
const authStore = useAuthStore();

definePageMeta({
    layout: "auth",
});

// For meta tags
useHead({
    meta: [
        {
            name: "robots",
            content: "noindex"
        }
    ]
})

const userLogin = async () => {
    try {
        loading.value = true;
        await authStore.login(username.value, password.value);
        router.push("/");
    } catch (err) {
        console.log(err)
        if (err.message.includes("401")) {
            snackbar.displayError("Wrong Username or Password")
        } else {
            snackbar.displayError("Error")
        }
    } finally {
        loading.value = false;
    }
}

</script>


<style scoped>
.background {
    height: 100vh !important;
}

</style>
