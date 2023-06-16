<template>
    <v-container>
        <h1>Index</h1>
      <AddEditIncomeExpense/>
    </v-container>

</template>

<script setup>
definePageMeta({
  middleware: ["auth"]
})
</script>

<style scoped>

</style>