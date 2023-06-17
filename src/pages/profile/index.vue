<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>Username: {{authStore.user.username}}</v-card-title>
        <v-card-subtitle>Email: {{authStore.user.email}}</v-card-subtitle>
        <v-card-actions>
          <v-btn
              color="primary"
              variant="text"
              :to="`${route.path}/${authStore.user._id}`"
          >
            Edit Profile
          </v-btn>

          <v-btn
              color="primary"
              variant="text"
              :to="`${route.path}/${authStore.user._id}/password`"
          >
            Change Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
</script>

<style scoped>

</style>