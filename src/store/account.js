import {defineStore} from 'pinia'

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [],
    loading: false,
    current: undefined
  }),
  getters: {
    count: (state) => state.accounts.length,
  },
  actions: {
    setCurrent(context) {
      const {route} = context
      this.current = this.accounts.find(a => a._id === route.value.params.id)
      //console.log(this.current)
    },
    async fetchAccounts(context) {
      this.loading = true
      try {
        const {$axios, $auth} = context
        await $axios.get(
          `/accounts/${$auth.user._id}`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
          .then((res) => {
            //console.log(res)
            this.accounts = res.data
            this.setCurrent(context)
          })
          /*.catch((e)=>{
            console.log(e)
          })*/
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async createAccount(account, context) {
      this.loading = true
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
          this.loading = false
        }
      });
    },
    async updateAccount(accountData, context) {
      this.loading = true
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
          this.loading = false
        }
      });
    },
    deleteAccount(context) {
      this.loading = true
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
          this.loading = false
        }
      });
    }
  },
})
