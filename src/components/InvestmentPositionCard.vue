<template>
  <v-card
    class="mx-auto"
    hover
    :to="`/investment/position/${position._id}`"
  >
    <v-card-title class="pb-0">
      {{ position.assetName }}
      <v-chip x-small class="ml-2" outlined>{{ assetTypeLabel }}</v-chip>
      <v-chip v-if="position.closed" x-small class="ml-1" color="grey" dark>CLOSED</v-chip>
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-subtitle class="align-self-center py-1">
        {{ position.quantity }} units · Avg {{ (avgCostPerUnit / 100).toFixed(2) }} €
      </v-card-subtitle>
      <v-card-title class="align-self-center py-1">
        {{ (marketValue / 100).toFixed(2) }} €
      </v-card-title>
    </div>
    <v-card-text class="pt-0">
      <span :class="unrealizedPnL >= 0 ? 'green--text' : 'red--text'">
        {{ unrealizedPnL >= 0 ? '+' : '' }}{{ (unrealizedPnL / 100).toFixed(2) }} €
        ({{ unrealizedPnLPercent >= 0 ? '+' : '' }}{{ unrealizedPnLPercent.toFixed(1) }}%)
      </span>
      <span v-if="position.realizedPnLAmount" class="ml-2 caption grey--text">
        Realized: {{ (position.realizedPnLAmount / 100).toFixed(2) }} €
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
const ASSET_TYPE_LABELS = {
  ETF: 'ETF', STOCK: 'Stock', BOND: 'Bond', MUTUAL_FUND: 'Mutual Fund',
  REAL_ESTATE: 'Real Estate', CRYPTO: 'Crypto', COMMODITY: 'Commodity',
  FIXED_TERM_DEPOSIT: 'Fixed-Term Deposit', SAVINGS_ACCOUNT: 'Savings Account'
}

export default {
  name: "InvestmentPositionCard",
  props: {
    position: Object
  },
  computed: {
    assetTypeLabel() {
      return ASSET_TYPE_LABELS[this.position.assetType] || this.position.assetType
    },
    marketValue() {
      return this.position.quantity * this.position.currentUnitPriceAmount
    },
    avgCostPerUnit() {
      return this.position.quantity > 0
        ? this.position.totalCostAmount / this.position.quantity
        : 0
    },
    unrealizedPnL() {
      return this.marketValue - this.position.totalCostAmount
    },
    unrealizedPnLPercent() {
      return this.position.totalCostAmount > 0
        ? (this.unrealizedPnL / this.position.totalCostAmount) * 100
        : 0
    }
  }
}
</script>

<style scoped>

</style>
