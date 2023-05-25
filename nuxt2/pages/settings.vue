<template>
<v-container>
  <v-row align="center" justify="center">
    <h1>Not yet implemented :)</h1>
  </v-row>
  <v-row align="center" justify="center">
    <h2>Test dark theme: </h2>
    <v-btn icon v-if="!$vuetify.theme.dark" @click="toggleTheme()">
      <v-icon class="mr-1" color="blue-grey darken-4">mdi-lightbulb</v-icon>
    </v-btn>
    <v-btn icon v-if="$vuetify.theme.dark" @click="toggleTheme()">
      <v-icon color="yellow darken-3">mdi-lightbulb-outline</v-icon>
    </v-btn>
  </v-row>
</v-container>
</template>

<script>
export default {
  name: "settings",
  methods:{
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
}
</script>

<style scoped>

</style>
