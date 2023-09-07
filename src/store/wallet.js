import {defineStore} from 'pinia'

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
      const {$axios, $auth, params} = context
      if (params.value.idW){
        this.loading++
        try {
          await $axios.$get(
            `/accounts/find/${params.value.idW}`,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
            .then((res) => {
              //console.log(res)
              this.current = res
            })
        } catch (error) {
          console.log(error)
        } finally {
          this.loading--
        }
      }
    },
    resetCurrent() {
      this.current = undefined
    },
    async fetchWallets(context) {
      this.loading++
      try {
        const {$axios, $auth} = context
        await $axios.get(
          `/accounts/${$auth.user._id}`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
          .then((res) => {
            //console.log(res)
            this.wallets = res.data
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
    async createWallet(wallet, context) {
      this.loading++
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.post(
            `/accounts/${$auth.user._id}`,
            wallet,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
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
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.put(
            `/accounts/${this.current._id}`,
            walletData,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
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
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.delete(
            `/accounts/${this.current._id}`,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
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
      try {
        const {$axios, $auth} = context
        await $axios.$get(
          `/accounts/drafts/${$auth.user._id}`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
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
