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
      if (idW && idW !== 'edit') {
        this.loading++
        const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/find/${idW}`, {
          method: "GET",
          headers: {
            "x-access-token": authStore.jwt
          }
        });
        if (error.value) {
          console.log(error.value)
        }
        else {
          this.current = data.value
        }
        this.loading--;
      }
    },
    resetCurrent() {
      this.current = undefined
    },
    async fetchWallets() {
      this.loading++
      const config = useRuntimeConfig().public
      const authStore = useAuthStore()
      if (typeof authStore.user !== 'undefined') {
        const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/${authStore.user._id}`, {
          method: "GET",
          headers: {
            "x-access-token": authStore.jwt
          }
        });
        if (error.value) {
          console.log(error.value)
        } else {
          this.wallets = data.value
          //console.log(this.wallets)
        }
      }
      this.loading--;
    },
    async createWallet(wallet) {
      this.loading++
      const authStore = useAuthStore()
      return new Promise(async (resolve, reject) => {
        try {
          const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/${authStore.user._id}`, {
            method: "POST",
            headers: {
              "x-access-token": authStore.jwt
            },
            body: wallet
          });
          if (error.value) {
            console.log(error.value)
            reject(error)
          }
          else {
            this.wallets.push(data.value)
            resolve(data.value)
          }
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    async updateWallet(walletData) {
      this.loading++
      const authStore = useAuthStore()
      return new Promise(async (resolve, reject) => {
        try {
          const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/${this.current._id}`, {
            method: "PUT",
            headers: {
              "x-access-token": authStore.jwt
            },
            body: walletData
          });
          if (error.value) {
            console.log(error.value)
            reject(error)
          }
          else {
            let updatedIndex = this.wallets.findIndex(w => w._id === this.current._id);
            this.wallets[updatedIndex] = data.value;
            resolve(data.value)
          }
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    deleteWallet() {
      this.loading++
      const authStore = useAuthStore()
      return new Promise(async (resolve, reject) => {
        try {
          const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/${this.current._id}`, {
            method: "DELETE",
            headers: {
              "x-access-token": authStore.jwt
            }
          });
          if (error.value) {
            console.log(error.value)
            reject(error)
          } else {
            this.wallets = this.wallets.filter(w => w.id !== this.current.id)
            resolve()
          }
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    async fetchDraftsWallet() {
      this.loading++
      const config = useRuntimeConfig().public
      const authStore = useAuthStore()
      const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/drafts/${authStore.user._id}`, {
        method: "GET",
        headers: {
          "x-access-token": authStore.jwt
        }
      });
      if (error.value) {
        console.log(error.value)
      }
      else {
        this.draftsWallet = data.value
      }
      this.loading--;
    },
  },
})
