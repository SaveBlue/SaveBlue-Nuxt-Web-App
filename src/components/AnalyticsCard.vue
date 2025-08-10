<template>
  <div>
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
        <IncomeExpenseBreakdown v-if="showGraphs" :isExpense="true" :incomeExpenseBreakdown="expenseBreakdown" @slice-click="openSubcategorySheet"/>
        <!-- Income Breakdown -->
        <IncomeExpenseBreakdown v-if="showGraphs" :incomeExpenseBreakdown="incomeBreakdown" @slice-click="openSubcategorySheet"/>

      </v-card-text>
    </v-card>

    <!-- Bottom Sheet: Subcategory Breakdown -->
    <v-bottom-sheet v-model="showSubSheet">
      <v-sheet class="px-4 pt-4 pb-2" :dark="$vuetify.theme.dark">
        <div class="d-flex align-center justify-space-between">
          <div class="subtitle-1 font-weight-medium">
            {{ selectedCategory.name }} – {{ (selectedCategory.sum / 100).toFixed(2) }} €
          </div>
          <v-btn icon @click="showSubSheet = false"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <v-list dense class="pt-2">
          <v-list-item v-for="(item, idx) in subcategoryItems" :key="idx" class="px-0">
            <v-list-item-content class="py-1">
              <div class="d-flex align-center justify-space-between">
                <v-list-item-title class="text-truncate">{{ item.name }}</v-list-item-title>
                <div class="ml-4 caption">
                  {{ (item.sum / 100).toFixed(2) }} € · {{ item.percent.toFixed(1) }}%
                </div>
              </div>
              <v-progress-linear
                :value="item.percent"
                height="8"
                :color="selectedCategory.color || 'primary'"
                rounded
                background-opacity="0.2"
                class="mt-1"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>
  </div>
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
      showGraphs: false,
      showSubSheet: false,
      selectedCategory: { name: '', sum: 0, isExpense: true },
      subcategoryItems: [],
      subChartSeries: []
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
    async openSubcategorySheet(payload) {
      const { name, sum, isExpense, color } = payload
      if (!isExpense) return
      this.selectedCategory = { name, sum, isExpense, color }

      // We already have the full expense breakdown shape from the main API
      // Find the matching primary category and use its category2 array
      const root = (Array.isArray(this.expenseBreakdown) ? this.expenseBreakdown : [])
        .find(item => (item.category1 || item._id) === name)

      const itemsRaw = root && Array.isArray(root.category2)
        ? root.category2.map(s => ({ _id: s.category2 || s._id || 'Other', sum: s.sum }))
        : []

      const items = itemsRaw.sort((a, b) => b.sum - a.sum)
      const total = items.reduce((acc, cur) => acc + cur.sum, 0) || 1
      this.subcategoryItems = items.map(i => ({
        name: i._id || i.name || 'Other',
        sum: i.sum,
        percent: (i.sum / total) * 100
      }))
      this.subChartSeries = []
      this.showSubSheet = true
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
