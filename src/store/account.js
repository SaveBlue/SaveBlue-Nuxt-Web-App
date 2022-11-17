import {defineStore} from 'pinia'
import {useContext} from '@nuxtjs/composition-api'
import {useSnackbarStore} from "~/store/snackbar";
import {state} from "@/store/index";

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [],
    current: undefined,
    loading: false
  }),
  getters: {
    /*current: (state) => {
      const {route} = useContext()
      return state.accounts.find(a => a._id === route.value.params.id)
    },*/
    count: (state) => state.accounts.length

  },
  actions: {
    setCurrent() {
      const {route} = useContext()
      this.current = this.accounts.find(a => a._id === route.value.params.id)
    },
    resetCurrent() {
      this.current = undefined
    },
    async fetchAccounts() {
      this.loading = true
      try {
        const {$axios, $auth} = useContext()
        await $axios.get(
          `/accounts/${$auth.user._id}`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
          .then((res) =>{
            this.accounts = res.data
          })
      } catch (error) {
        //console.log(error)
      } finally {
        this.loading = false
      }
    },
    async createAccount(account, context) {
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
        }
      });
    },
    async updateAccount(accountData, context) {
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
        }
      });
    },
    deleteAccount (context) {
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
        }
      });
    }
  },
})
