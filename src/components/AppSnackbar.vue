<template>
  <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
    {{ snackbar.text }}
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="snackbar.visible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {useSnackbarStore} from '@/store/snackbar'
export default {
  computed:{
    snackbar: () => useSnackbarStore()
  }
}
</script>

<style scoped>

</style>
