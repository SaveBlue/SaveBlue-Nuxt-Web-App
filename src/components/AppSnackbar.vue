<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color">
    {{ text }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="visible = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import {useSnackbarStore} from '~/stores/snackbar'
import {storeToRefs} from "pinia";

const snackbarStore = useSnackbarStore()
const {visible, timeout, color, text} = storeToRefs(snackbarStore);
</script>

<style scoped>

</style>
