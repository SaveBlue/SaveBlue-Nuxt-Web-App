<template>
  <v-card flat class="mx-auto text-center">

    <v-card-title class="justify-center">
      Portfolio Breakdown
    </v-card-title>

    <v-card-text>
      <VueApexCharts v-if="series && series.length" class="d-flex justify-center" type="donut" :options="chartOptions"
                     :series="series"></VueApexCharts>
      <h1 v-else>No Positions</h1>
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
  name: "InvestmentBreakdown",
  props: {
    breakdown: Array
  },
  computed: {
    series() {
      const series = []
      this.breakdown.forEach((element) => {
        if (typeof element.totalMarketValue === 'number') series.push(element.totalMarketValue)
      })
      return series
    },
    chartOptions() {
      let chartOptions = {
        labels: [],
        stroke: {
          show: true,
          colors: this.$vuetify.theme.dark ? '#00000099' : '#ffffffb3'
        },
        responsive: [{
          breakpoint: 1000,
          options: {
            chart: {
              width: 450
            },
            legend: {
              show: false,
              width: 350,
              horizontalAlign: 'right',
              position: 'bottom'
            }
          }
        }],
        tooltip: {
          onDatasetHover: {
            highlightDataSeries: true,
          },
          y: {
            formatter: (value, opts) => {
              let sum = opts.globals.seriesTotals.reduce((a, b) => a + b, 0);
              let percent = (value / sum) * 100;
              return percent.toFixed(1) + '%';
            }
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 360
            },
            donut: {
              size: '75%',
              labels: {
                show: true,
                value: {
                  color: this.$vuetify.theme.dark ? '#ffffffb3' : '#00000099',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  formatter: (value) => {
                    return (value / 100).toFixed(2).toString() + " €";
                  }
                },
                total: {
                  show: true,
                  label: "Total",
                  fontWeight: 600,
                  fontSize: '1.6rem',
                  color: this.$vuetify.theme.dark ? '#ffffff' : '#000000de',
                  formatter: function (w) {
                    return (w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0) / 100).toFixed(2).toString() + " €";
                  }
                }
              }
            }
          }
        }
      }
      this.breakdown.forEach((element) => {
        chartOptions.labels.push(ASSET_TYPE_LABELS[element._id] || element._id)
      })
      return chartOptions
    }
  }
}
</script>

<style scoped>
</style>
