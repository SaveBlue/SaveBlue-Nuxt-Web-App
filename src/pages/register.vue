<template>
  <v-container>
    <v-row style="height: 100vh" align="center" justify="center">
      <v-card width="400" class="ma-3" elevation="12">
        <v-toolbar color="primary">
          <v-avatar size="50" class="my-3 mr-3 ml-3 rounded-circle" image="logo.png"/>
          <h1>Register</h1>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" @submit.prevent="userRegister">
            <v-text-field
                v-model="username"
                counter="32"
                variant="underlined"
                color="primary"
                label="Username"
                :rules="usernameRules"
                prepend-icon="mdi-account-circle"
                :disabled="loading"
            />
            <v-text-field
                v-model="email"
                counter="128"
                variant="underlined"
                color="primary"
                label="Email"
                prepend-icon="mdi-email"
                :rules="emailRules"
                :disabled="loading"
            />
            <v-text-field
                v-model="password1"
                variant="underlined"
                counter="128"
                label="New Password"
                :rules="passwordRules"
                :type="showPassword1 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword1 = !showPassword1"
            ></v-text-field>
            <v-text-field
                v-model="password2"
                variant="underlined"
                counter="128"
                label="Repeat New Password"
                :rules=[matchRule]
                validate
                :type="showPassword2 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword2 = !showPassword2"
            />
            <div class="pt-4 d-flex justify-space-between">
              <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Register</v-btn>
              <v-btn color="primary" variant="text" to="login" :disabled="loading">Back</v-btn>
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
const email = ref('');
const password1 = ref('');
const password2 = ref('');
const showPassword1 = ref(false);
const showPassword2 = ref(false);
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

const usernameRules = [
  v => !!v || 'Required Field',
  v => v.length <= 32 || 'Username too long',
]

const passwordRules = [
  v => !!v || 'Required Field',
  v => v.length <= 128 || 'Password too long',
  v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password not strong enough',
];

const matchRule = computed(() => (password1.value === password2.value) || 'Passwords must match');

const emailRules = [
  v => !!v || "Required Field",
  v => !!v && v.length <= 128 || "Field too Long",
  v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "Invalid email"
]

const userRegister = async () => {
  try {
    loading.value = true;
    await authStore.register(username.value, email.value, password1.value);
    navigateTo("/login");
  } catch (err) {
    console.log(err)
    if (err.message.includes("409")) {
      snackbar.displayError("Duplicate username")
    }
    else {
      snackbar.displayError("Invalid input")
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
