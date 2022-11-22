import {defineStore} from 'pinia'
import {useContext} from "@nuxtjs/composition-api";

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    income: [],
    expense: [],
    loading: 0
  }),
  actions: {
    async fetchIncome() {
      this.loading++
      try {
        const {$axios, $auth} = useContext()
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
        const {$axios, $auth} = useContext()
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
