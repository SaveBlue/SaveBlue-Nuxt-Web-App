<template>
  <v-footer padless class="mt-md-8">
    <v-card flat tile width="100%" color="grey" class="lighten-3 text-center">
      <v-card-text class="black--text">
        &copy; SaveBlue {{ new Date().getFullYear() }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped>

</style>
