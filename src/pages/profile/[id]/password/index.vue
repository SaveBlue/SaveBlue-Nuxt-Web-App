<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-form ref="form" validate-on="input lazy" @submit.prevent="updatePassword" v-model="valid">
            <v-text-field
              v-model="password1"
              variant="underlined"
              :counter="128"
              label="New Password"
              :rules="passwordRules"
              :type="showPassword1 ? 'text' : 'password'"
              :append-inner-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword1 = !showPassword1"
            ></v-text-field>
            <v-text-field
              v-model="password2"
              variant="underlined"
              :counter="128"
              label="Repeat New Password"
              :rules=[matchRule]
              validate
              :type="showPassword2 ? 'text' : 'password'"
              :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword2 = !showPassword2"
            />
            <div class="d-flex justify-space-between">
              <v-btn color="primary" type="submit">Update password</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useSnackbarStore } from '~/stores/snackbar';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig().public

const valid = ref(null);
const password1 = ref('');
const password2 = ref('');
const dialog = ref(false);
const showPassword1 = ref(false);
const showPassword2 = ref(false);
const snackbar = useSnackbarStore();
const authStore = useAuthStore();
const route = useRoute()

const passwordRules = [
  v => !!v || 'Required Field',
  v => v.length <= 128 || 'Password too long',
  v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) || 'Password not strong enough',
];

const matchRule = computed(() => (password1.value === password2.value) || 'Passwords must match');

async function updatePassword() {
  console.log(valid.value)
  if (valid.value) {
    try {
      const { error } = await useFetch(`${config.baseApiUrl}/users/${route.params.id}`,{
        method: "PUT",
        headers: {
          "x-access-token": authStore.jwt
        },
        body: { 'password': password1.value },
      });
      if (error.value) {
        console.log(error.value)
        snackbar.displayError("Unknown error")
      }
      else {
        await authStore.logout();
        snackbar.displaySuccess('Password changed');
      }
    } catch {
      snackbar.displayError('Error updating password');
    }
  } else {
    snackbar.displayError('Invalid password data');
  }
}
</script>

<style scoped>

</style>
