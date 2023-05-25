<template>
  <v-container>
    <v-row align="center" justify="center" class="pa-4">
      <v-card>
        <v-card-title>Username: {{$auth.user.username}}</v-card-title>
        <v-card-subtitle>Email: {{$auth.user.email}}</v-card-subtitle>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            :to="`${this.$auth.user._id}`"
            append
          >
            Edit Profile
          </v-btn>

          <v-btn
            color="primary"
            text
            :to="`${this.$auth.user._id}/password`"
            append
          >
            Change Password
          </v-btn>
        </v-card-actions>
      </v-card>
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
