<template>
  <v-card class="mx-auto text-center">

    <v-card-title class="justify-center">
      {{isExpense ? "Expense Breakdown" : "Income Breakdown"}}
    </v-card-title>

    <v-card-text>
      <VueApexCharts class="d-flex justify-center" type="donut" :options="chartOptions"
                     :series="series"></VueApexCharts>
    </v-card-text>
  </v-card>

</template>

<script>

export default {
  name: "IncomeExpenseBreakdown",
  data() {
    return {
    }
  },
  props: {
    incomeExpenseBreakdown: Array,
    isExpense: Boolean
  },
  computed: {
    series() {
      let series = []
      this.incomeExpenseBreakdown.forEach((element) => {
        series.push(element.sum)
      })
      return series
    },
    chartOptions() {
      let chartOptions = {
        labels: [],
        stroke: {
          show: false
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
              // TODO: call from storage
              let sum = opts.globals.seriesTotals.reduce((a, b) =>  a + b, 0);
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
                  //offsetY: -10,
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
      this.incomeExpenseBreakdown.forEach((element) => {
        chartOptions.labels.push(element._id)
      })
      return chartOptions
    }
  }
}
</script>

<style scoped>
</style>
