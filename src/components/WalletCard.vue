<template>
    <v-card
            class="mx-auto"
            :to="isNew ? 'wallet/create' :`/wallet/${wallet._id}`"
    >
        <div class="d-flex flex-no-wrap">
            <v-img
                    :src="isNew ? 'addsavebluebanner.png':'savebluebanner.png'"
                    max-width="33%"
            ></v-img>

            <div>
                <v-card-title v-if="isNew">New Wallet</v-card-title>
                <v-card-title v-else>{{ wallet.name }}</v-card-title>

                <v-card-title v-if="isNew"><br></v-card-title>
                <v-card-title v-else>{{(wallet.availableBalance/100).toFixed(2) }} €</v-card-title>
            </div>
        </div>
    </v-card>

</template>

<script setup>

defineProps({
    wallet: Object,
    isNew: Boolean
})
</script>

<style scoped>

</style>
