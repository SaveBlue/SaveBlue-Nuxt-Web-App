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
    async fetchCurrent(context) {
      const config = useRuntimeConfig().public
      const {idW} = useRoute().params;
      const authStore = useAuthStore()
      if (route.params.value.idW){
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
      const {data, error} = await useFetch(`${config.baseApiUrl}/accounts/${authStore.user._id}`, {
        method: "GET",
        headers: {
          "x-access-token": authStore.jwt
        }
      });
      if (error.value) {
        console.log(error.value)
      }
      else {
        this.wallets = data.value
        console.log(this.wallets)
      }
      this.loading--;
    },
    async createWallet(wallet, context) {
      this.loading++
      const authStore = useAuthStore()
      return new Promise((resolve, reject) => {
        try {
          //const {$axios, $auth} = context
          $axios.post(
            `/accounts/${authStore.user._id}`,
            wallet,
            {headers: {"x-access-token": authStore.jwt}})
            .then((res) => {
              this.wallets.push(res.data)
              resolve(res.data)
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    async updateWallet(walletData, context) {
      this.loading++
      const authStore = useAuthStore()
      return new Promise((resolve, reject) => {
        try {
          //const {$axios, $auth} = context
          $axios.put(
            `/accounts/${this.current._id}`,
            walletData,
            {headers: {"x-access-token": authStore.jwt}})
            .then((res) => {
              let updatedIndex = this.wallets.findIndex(w => w._id === this.current._id);
              this.wallets[updatedIndex] = res.data;
              resolve(res.data)
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    deleteWallet(context) {
      this.loading++
      const authStore = useAuthStore()
      return new Promise((resolve, reject) => {
        try {
          //const {$axios, $auth} = context
          $axios.delete(
            `/accounts/${this.current._id}`,
            {headers: {"x-access-token": authStore.jwt}})
            .then(() => {
              this.wallets = this.wallets.filter(w => w.id !== this.current.id)
              resolve()
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    async fetchDraftsWallet(context) {
      this.loading++
      const authStore = useAuthStore()
      try {
        //const {$axios, $auth} = context
        await $axios.$get(
          `/accounts/drafts/${authStore.user._id}`,
          {headers: {"x-access-token": authStore.jwt}})
          .then((res) => {
            this.draftsWallet = res
          })
        /*.catch((e)=>{
          console.log(e)
        })*/
      } catch (error) {
        console.log(error)
      } finally {
        this.loading--
      }
    },
  },
})
