<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>{{$auth.user.username}}</v-card-title>
        <v-card-subtitle>{{$auth.user.email}}</v-card-subtitle>
        <v-card-actions>
          <v-btn
            color="primary"
            text
          >
            Edit Profile
          </v-btn>

          <v-btn
            color="primary"
            text
          >
            Change Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row align="center" justify="center" class="pa-4">
      <v-btn color="secondary" @click="$auth.logout()">Logout</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "profile"
}
</script>

<style scoped>

</style>
