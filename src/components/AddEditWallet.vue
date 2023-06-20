<template>

  <!-- Loader -->
    <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
        <v-col cols="2">
            <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
        </v-col>
    </v-row>

  <!-- Content -->
    <div v-else>
        <v-app-bar color="primary">
            <v-app-bar-nav-icon @click="router.back()">
                <v-icon>mdi-close</v-icon>
            </v-app-bar-nav-icon>

            <v-toolbar-title v-if="edit">{{ wallet.name }}</v-toolbar-title>
            <v-toolbar-title v-else>New Wallet</v-toolbar-title>

        </v-app-bar>
        <v-container>
            <v-card>
                <v-card-text>
                    <v-row align="center" justify="center">
                        <v-col cols="12">
                            <v-text-field
                                    v-model="wallet.name"
                                    :counter="32"
                                    label="Wallet Name"
                                    prepend-icon="mdi-wallet"
                                    variant="underlined"
                            />
                            <v-slider
                                    label="Billing day"
                                    prepend-icon="mdi-update"
                                    v-model="wallet.startOfMonth"
                                    min="1"
                                    max="31"
                                    step="1"
                                    thumb-label
                                    show-ticks
                            />
                            <v-row v-show="!edit">
                                <v-col cols="12">
                                    <v-btn type="submit" color="primary" @click="handleCreateWallet">Create Wallet
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-show="edit">
                                <v-col cols="12">
                                    <v-btn type="submit" color="primary" @click="handleUpdateWallet">Update Wallet
                                    </v-btn>

                                    <v-btn class="my-3" type="submit" color="error" variant="text"
                                           @click="dialog=true">Delete Wallet
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-dialog v-model="dialog" max-width="290">
                <v-card>
                    <v-card-title class="text-h5">
                        Delete Wallet?
                    </v-card-title>

                    <v-card-text>
                        Delete the wallet and all its contents?
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="primary" @click="dialog = false">No</v-btn>
                        <v-btn color="error" variant="text" @click="handleDeleteWallet">Yes</v-btn>

                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script setup>

import {useWalletStore} from '~/stores/wallet'
import {useSnackbarStore} from "~/stores/snackbar";
import {storeToRefs} from "pinia";

const props = defineProps({
    edit: {
        type: Boolean,
        default: false
    }
})

const wallet = ref({
    name: "",
    startOfMonth: 1
})
const dialog = ref(false)

const {current: currentWallet, getLoading:loading} = storeToRefs(useWalletStore())

const snackbar = useSnackbarStore()
const router = useRouter();

watch(loading, (newVal, oldVal) => {
    if (props.edit && oldVal && !newVal) {
        wallet.value = currentWallet.value;
    }
})

onMounted(() => {
    if (props.edit && !loading.value) {
        if (typeof currentWallet.value !== "undefined") {
            wallet.value = currentWallet.value;
        }
    }
});

const handleCreateWallet = async () => {
    try {
        await useWalletStore().createWallet(wallet);
        navigateTo('/')
        snackbar.displayPrimary("Wallet created");
    } catch (error) {
        snackbar.displayError("Wallet not created");
    }
}

const handleUpdateWallet = () => {

}

const handleDeleteWallet = () => {

}

</script>

<style scoped>

</style>
