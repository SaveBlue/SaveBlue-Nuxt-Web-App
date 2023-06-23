import {defineStore} from 'pinia'
import {useAuthStore} from "~/stores/auth";

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
      const config = useRuntimeConfig().public
      const authStore = useAuthStore()
      const res = {data: null, error: null}
      try {
        res.data = await $fetch(`${config.baseApiUrl}/incomes`, {
          headers: {
            "x-access-token": authStore.jwt
          }
        })
        this.income = res.data
      } catch (e) {
        res.error = e;
        throw new Error(res.error);
      } finally {
        this.loading--;
      }
    },
    async fetchExpense() {
      this.loading++
      const config = useRuntimeConfig().public
      const authStore = useAuthStore()
      const res = {data: null, error: null}
      try {
        res.data = await $fetch(`${config.baseApiUrl}/expenses`, {
          headers: {
            "x-access-token": authStore.jwt
          }
        })
        this.expense = res.data
      } catch (e) {
        res.error = e;
        throw new Error(res.error);
      } finally {
        this.loading--;
      }
    },
  }
})
