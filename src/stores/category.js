import {defineStore} from 'pinia'

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    income: [],
    expense: [],
    loading: 0
  }),
  getters: {
    getLoading: (state) => !!(state.loading)
  },
  actions: {
    async fetchIncome() {
      this.loading++
      try {
        const {$axios, $auth} = useNuxtApp();
        const res = await $axios.get(
          `/incomes`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
        this.income = res.data
      } catch (error) {
        console.log(error)
      }
      finally {
        this.loading--
      }
    },
    async fetchExpense() {
      try {
        this.loading++
        const {$axios, $auth} = useNuxtApp();
        const res = await $axios.get(
          `/expenses`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
        this.expense = res.data
      } catch (error) {
        console.log(error)
      }
      finally {
        this.loading--
      }
    },
  }
})
