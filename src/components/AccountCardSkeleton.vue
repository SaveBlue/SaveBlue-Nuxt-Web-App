<template>
  <v-card class="mx-auto">
    <div class="d-flex flex-no-wrap">
      <div style="width: 33%">
        <v-skeleton-loader type="image" height="130"/>
      </div>
      <div style="width:67%">
        <v-skeleton-loader type="card-heading"/>
        <v-skeleton-loader type="card-heading" width="70%"/>
      </div>
    </div>
  </v-card>

</template>

<script>
export default {
  name: "AccountCardSkeleton"
}
</script>

<style scoped>

</style>
