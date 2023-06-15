<template>
  <div class="fab-container" :class="{ 'fab-active': fab }" style="z-index: 10000">
    <v-btn
        abs
        v-model="fab"
        color="accent"
        location="bottom right"
        class="toggleUpDown text-white"
        :class="{ 'rotate': fab }"
        @click="fab = !fab"
        icon="mdi-plus"
    />
    <v-slide-y-reverse-transition>
      <v-btn
          v-show="fab"
          transition
          size="small"
          color="red"
          to="/expense/add"
          class="mb-4"
          icon="mdi-minus"
      />
    </v-slide-y-reverse-transition>
    <v-slide-y-reverse-transition>
      <v-btn
          v-show="fab"
          size="small"
          color="green"
          to="/income/add"
          class="mb-4"
          icon="mdi-plus"
      />
      </v-slide-y-reverse-transition>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const fab = ref(false)
</script>

<style scoped>
.fab-container {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

.toggleUpDown {
  transition: transform .3s ease-in-out !important;
}

.toggleUpDown.rotate {
  transform: rotate(45deg);
}
</style>