<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>Edit Profile Details</v-card-title>
        <v-card-text>
          <v-form ref="form" validate-on="submit" @submit.prevent="updateProfile" v-model="valid">
            <v-text-field
              v-model="profile.username"
              variant="underlined"
              counter="32"
              label="Username"
              :rules="usernameRules"
            />
            <v-text-field
              v-model="profile.email"
              variant="underlined"
              counter="128"
              label="Email"
              :rules="emailRules"
            />
            <div class="d-flex justify-space-between">
              <v-btn color="primary" type="submit">Update profile</v-btn>
              <v-btn variant="text" color="error" @click="dialog = true">Delete profile</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          Delete Wallet?
        </v-card-title>

        <v-card-text>
          Delete the wallet and all its contents? Wallet data will be removed and the action is irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            @click="dialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="error"
            variant="text"
            @click="deleteProfile"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useSnackbarStore } from "~/stores/snackbar"
import { useAuthStore } from "~/stores/auth"

const config = useRuntimeConfig().public

const snackbar = useSnackbarStore()
const authStore = useAuthStore()
const route = useRoute()

const dialog = ref(false)
const profile = ref({
  username: "",
  email: ""
})
const valid = ref(null)



const usernameRules = [
  v => !!v || "Required Field",
  v => !!v && v.length <= 32 || "Field too Long",
]

const emailRules = [
  v => !!v || "Required Field",
  v => !!v && v.length <= 128 || "Field too Long",
  v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "Invalid email"
]

const fetchProfile = async () => {
  const { data, error } = await useFetch(`${config.baseApiUrl}/users/${route.params.id}`,{
    method: "GET",
    headers: {
      "x-access-token": authStore.jwt
    }
  });
  if (error.value) {
    console.log("err " + error.value)
  }
  else {
    console.log(data.value)
    profile.value.username = data.value.username
    profile.value.email = data.value.email
  }
}
fetchProfile()

const updateProfile = async () => {
  if (valid.value) {
    try {
      const { error } = await useFetch(`${config.baseApiUrl}/users/${route.params.id}`,{
        method: "PUT",
        headers: {
          "x-access-token": authStore.jwt
        },
        body: profile.value
      });
      if (error.value) {
        console.log(error.value)
        snackbar.displayError("Unknown error")
      }
      else {
        authStore.logout()
        snackbar.displaySuccess("Profile updated")
      }
    } catch {
      snackbar.displayError("Error updating profile")
    }
  } else {
    snackbar.displayError("Invalid profile data")
  }
}

const deleteProfile = async () => {
  try {
    const { error } = await useFetch(`${config.baseApiUrl}/users/${route.params.id}`,{
      method: "DELETE",
      headers: {
        "x-access-token": authStore.jwt
      }
    });
    if (error.value) {
      console.log(error.value)
      snackbar.displayError("Unknown error")
    }
    else {
      authStore.logout()
      snackbar.displaySuccess("User profile deleted")
    }
  } catch {
    snackbar.displayError("Error deleting profile")
  }
}
</script>

<style scoped>

</style>
