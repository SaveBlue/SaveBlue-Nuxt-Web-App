import {defineStore} from 'pinia'

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [],
    loading: 0,
    current: undefined
  }),
  getters: {
    count: (state) => state.accounts.length,
  },
  actions: {
    async fetchCurrent(context) {
      const {$axios, $auth, params} = context
      if (params.value.id){
        this.loading++
        try {
          await $axios.$get(
            `/accounts/find/${params.value.id}`,
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
    async fetchAccounts(context) {
      this.loading++
      try {
        const {$axios, $auth} = context
        await $axios.get(
          `/accounts/${$auth.user._id}`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
          .then((res) => {
            //console.log(res)
            this.accounts = res.data
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
    async createAccount(account, context) {
      this.loading++
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.post(
            `/accounts/${$auth.user._id}`,
            account,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
            .then((res) => {
              this.accounts.push(res.data)
              resolve(res.data)
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    async updateAccount(accountData, context) {
      this.loading++
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.put(
            `/accounts/${this.current._id}`,
            accountData,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
            .then((res) => {
              let updatedIndex = this.accounts.findIndex(a => a._id === this.current._id);
              this.accounts[updatedIndex] = res.data;
              resolve(res.data)
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    },
    deleteAccount(context) {
      this.loading++
      return new Promise((resolve, reject) => {
        try {
          const {$axios, $auth} = context
          $axios.delete(
            `/accounts/${this.current._id}`,
            {headers: {"x-access-token": $auth.strategy.token.get()}})
            .then(() => {
              this.accounts = this.accounts.filter(a => a.id !== this.current.id)
              resolve()
            })
        } catch (error) {
          reject(error)
        } finally {
          this.loading--
        }
      });
    }
  },
})
