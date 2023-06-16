<template>
    <v-card class="mx-auto">
        <div class="d-flex flex-no-wrap">
            <div style="width: 33%">
                <v-skeleton-loader type="image" height="130"/>
            </div>
            <div style="width:67%">
                <v-skeleton-loader type="heading"/>
                <v-skeleton-loader type="heading" width="70%"/>
            </div>
        </div>
    </v-card>

</template>

<script setup>
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
</script>

<style scoped>

</style>
