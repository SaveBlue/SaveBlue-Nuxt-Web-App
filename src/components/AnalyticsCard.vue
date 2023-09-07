<template>

  <!-- Loader -->
  <v-card v-if="loading" height="190" class="py-3">
    <v-skeleton-loader type="image" height="100%"/>
  </v-card>

  <!-- Content -->
  <v-card v-else class="mx-auto text-center">

    <v-card-title class="justify-center">Analytics</v-card-title>

    <v-card-text>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="dateRange"
        open-on-focus
      >
        <template v-slot:activator="{ on, attrs }">

          <v-combobox
            append-icon=""
            v-model="selectedDateRange"
            item
            multiple
            small-chips
            label="Time Period"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            dense
            tabindex="2"

          />
        </template>
        <v-date-picker
          v-model="selectedDateRange"
          range
          scrollable
          first-day-of-week="1"
          width="auto"
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="modal = false; selectedDateRange = dateRange"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="modal = false; $refs.dialog.save(selectedDateRange)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>

      <!-- Expense Breakdown -->
      <IncomeExpenseBreakdown v-if="showGraphs" :isExpense="true" :incomeExpenseBreakdown="expenseBreakdown"/>
      <!-- Income Breakdown -->
      <IncomeExpenseBreakdown v-if="showGraphs" :incomeExpenseBreakdown="incomeBreakdown"/>

    </v-card-text>
  </v-card>
</template>

<script>

import {useWalletStore} from "@/store/wallet";

export default {
  name: "AnalyticsCard",
  data() {
    return {
      dateRange: ["", ""],
      selectedDateRange: ["", ""],
      modal: false,
      expenseBreakdown: [],
      incomeBreakdown: [],
      showGraphs: false
    }
  },
  computed: {
    wallet: () => useWalletStore().current,
    loading: () => useWalletStore().getLoading,
  },
  methods: {
    async loadData() {

      // Set date range
      await this.setInitialDateRange()

      // Expense breakdown
      /*this.getExpenseBreakdown().then(breakdown => {
        this.expenseBreakdown = breakdown
      })*/

      // Income breakdown
      /*this.getIncomeBreakdown().then(breakdown => {
        this.incomeBreakdown = breakdown
      })*/
    },
    getExpenseBreakdown() {
      return this.$axios.$get(
        `/expenses/breakdown/${this.wallet._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      )
    },
    getIncomeBreakdown() {
      return this.$axios.$get(
        `/incomes/breakdown/${this.wallet._id}`,
        {
          headers: {"x-access-token": this.$auth.strategy.token.get()},
          params: {startDate: this.startDate, endDate: this.endDate}
        }
      )
    },
    async setInitialDateRange() {
      let d = new Date(Date.now());
      let start, end;
      end = d.toISOString().split('T')[0];
      (this.wallet.startOfMonth - d.getDate() > 0) && d.setMonth(d.getMonth() - 1);
      d.setDate(this.wallet.startOfMonth);
      start = d.toISOString().split('T')[0];
      this.dateRange = [start, end];
      this.selectedDateRange = this.dateRange
    },
  },
  async fetch() {
    // Change route
    if (!this.loading) {
      await this.loadData()
    }
  },
  watch: {
    // Refresh page
    async loading(newValue, oldValue) {
      if (oldValue && !newValue) {
        await this.loadData()
      }
    },

    dateRange: async function (newVal, oldVal) {

      if (newVal !== oldVal) {
        this.showGraphs = false
        // TODO: make more efficient
        // Order dates
        let start = newVal[0]
        let end = newVal[1] ? newVal[1] : newVal[0]
        let compare = start.localeCompare(end)
        if (compare > 0) {
          this.startDate = end
          this.endDate = start
        } else {
          this.startDate = start
          this.endDate = end
        }

        // Expense breakdown
        this.expenseBreakdown = await this.getExpenseBreakdown()

        // Income breakdown
        this.incomeBreakdown = await this.getIncomeBreakdown()

        this.showGraphs = true
      }
    }
  }
}
</script>

<style scoped>

</style>
