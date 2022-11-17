import {defineStore} from 'pinia'
import {useContext} from "@nuxtjs/composition-api";

export const useCategoryStore = defineStore('categoryStore', {
  state: () => ({
    income: [],
    expense: []
  }),
  actions: {
    async fetchIncome() {
      try {
        const {$axios, $auth} = useContext()
        const res = await $axios.get(
          `/incomes`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
        this.income = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async fetchExpense() {
      try {
        const {$axios, $auth} = useContext()
        const res = await $axios.get(
          `/expenses`,
          {headers: {"x-access-token": $auth.strategy.token.get()}})
        this.expense = res.data
      } catch (error) {
        console.log(error)
      }
    },
  }
})
