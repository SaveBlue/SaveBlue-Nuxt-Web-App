import {defineStore} from 'pinia'
import {useAuthStore} from "~/stores/auth";

export const useWalletStore = defineStore('walletStore', {
    state: () => ({
        wallets: [],
        loading: 0,
        current: undefined,
        draftsWallet: undefined
    }),
    getters: {
        getLoading: (state) => !!(state.loading),
        count: (state) => state.wallets.length,
    },
    actions: {
        async fetchCurrent() {
            const config = useRuntimeConfig().public
            const authStore = useAuthStore()
            const {idW} = useRoute().params;
            if (idW) {
                this.loading++
                const res = {data: null, error: null}
                try {
                    res.data = await $fetch(`${config.baseApiUrl}/accounts/find/${idW}`, {
                        method: 'GET',
                        headers: {
                            "x-access-token": authStore.jwt
                        }
                    })
                    this.current = res.data
                } catch (e) {
                    res.error = e;
                    throw new Error(res.error);
                } finally {
                    this.loading--;
                }
            }
        },
        resetCurrent() {
            this.current = undefined
        },
        resetAll() {
            this.wallets = []
            this.current = undefined;
            this.draftsWallet = undefined
        },
        async fetchWallets() {
            const authStore = useAuthStore()
            if (typeof authStore.user !== 'undefined' && authStore.user !== null) {
                this.loading++
                const config = useRuntimeConfig().public
                const res = {data: null, error: null}
                try {
                    res.data = await $fetch(`${config.baseApiUrl}/accounts/${authStore.user._id}`, {
                        method: 'GET',
                        headers: {
                            "x-access-token": authStore.jwt
                        }
                    })
                    this.wallets = res.data
                } catch (e) {
                    res.error = e;
                    throw new Error(res.error);
                } finally {
                    this.loading--;
                }
            }
        },
        async createWallet(wallet) {
            this.loading++
            const config = useRuntimeConfig().public
            const authStore = useAuthStore()
            const res = {data: null, error: null}
            try {
                res.data = await $fetch(`${config.baseApiUrl}/accounts/${authStore.user._id}`, {
                    method: "POST",
                    headers: {
                        "x-access-token": authStore.jwt
                    },
                    body: wallet.value
                });
                this.wallets.push(res.data)
                console.log("dela")
            } catch (e) {
                res.error = e;
                throw new Error(res.error);
            } finally {
                this.loading--;
            }
        },
        async updateWallet() {
            this.loading++
            const config = useRuntimeConfig().public
            const authStore = useAuthStore()
            const res = {data: null, error: null}
            try {
                res.data = await $fetch(`${config.baseApiUrl}/accounts/${this.current._id}`, {
                    method: "PUT",
                    headers: {
                        "x-access-token": authStore.jwt
                    },
                    body: this.current
                });
                let updatedIndex = this.wallets.findIndex(w => w._id === this.current._id);
                this.wallets[updatedIndex] = res.data;
            } catch (e) {
                res.error = e;
                throw new Error(res.error);
            } finally {
                this.loading--;
            }
        },
        async deleteWallet() {
            this.loading++
            const config = useRuntimeConfig().public
            const authStore = useAuthStore()
            const res = {data: null, error: null}
            try {
                res.data = await $fetch(`${config.baseApiUrl}/accounts/${this.current._id}`, {
                    method: "DELETE",
                    headers: {
                        "x-access-token": authStore.jwt
                    }
                });
                this.wallets = this.wallets.filter(w => w._id !== this.current._id)
            } catch (e) {
                res.error = e;
                throw new Error(res.error);
            } finally {
                this.loading--;
            }
        },
        async fetchDraftsWallet() {
            this.loading++
            const config = useRuntimeConfig().public
            const authStore = useAuthStore()
            const res = {data: null, error: null}
            try {
                res.data = await $fetch(`${config.baseApiUrl}/accounts/drafts/${authStore.user._id}`, {
                    method: "GET",
                    headers: {
                        "x-access-token": authStore.jwt
                    }
                });
                this.draftsWallet = res.data
            } catch (e) {
                res.error = e;
                throw new Error(res.error);
            } finally {
                this.loading--;
            }
        },
    },
})
