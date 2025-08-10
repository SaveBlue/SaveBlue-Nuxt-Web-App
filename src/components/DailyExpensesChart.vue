<template>
  <v-card flat class="mx-auto text-center">
    <v-card-title class="justify-center">Daily Expenses</v-card-title>
    <v-card-text>
      <VueApexCharts
        class="d-flex justify-center"
        v-if="series && series.length"
        type="area"
        width="400"
        :options="chartOptions"
        :series="series"
      />
      <h1 v-else>No Expenses</h1>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'DailyExpensesChart',
  props: {
    data: { type: Array, required: true }
  },
  computed: {
    series() {
      const totalsEuro = Array.isArray(this.data) ? this.data.map(d => (d.total || 0) / 100) : []
      return totalsEuro.length ? [{ name: 'Daily Expenses', data: totalsEuro }] : []
    },
    chartOptions() {
      const dates = Array.isArray(this.data) ? this.data.map(d => d.date) : []
      const totalsEuro = Array.isArray(this.data) ? this.data.map(d => (d.total || 0) / 100) : []
      const avg = totalsEuro.length ? (totalsEuro.reduce((a, b) => a + b, 0) / totalsEuro.length) : 0
      const primary = this.getPrimaryColor()
      const isDark = this.$vuetify && this.$vuetify.theme && this.$vuetify.theme.dark
      return {
        chart: {
          id: 'daily-expenses',
          toolbar: { show: false },
          zoom: { enabled: false },
          selection: { enabled: false },
          pan: { enabled: false }
        },
        annotations: {
          yaxis: avg > 0 ? [{
            y: avg,
            borderColor: primary,
            strokeDashArray: 4,
            label: {
              position: 'right',
              offsetY: -8,
              text: `${avg.toFixed(2)} €`,
              style: {
                color: isDark ? '#ffffff' : '#000000',
                background: isDark ? '#263238' : '#ffffff'
              }
            }
          }] : []
        },
        stroke: { curve: 'smooth', width: 2 },
        colors: [this.getPrimaryColor()],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0,
            stops: [0, 100]
          }
        },
        markers: { size: 4, strokeWidth: 0, hover: { sizeOffset: 6 } },
        xaxis: {
          categories: dates,
          labels: { show: false },
          tooltip: { enabled: false }
        },
        yaxis: { show: false },
        tooltip: {
          enabled: true,
          shared: false,
          intersect: true,
          x: { show: false },
          y: { formatter: (val) => `${Number(val).toFixed(2)} €` },
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const val = series && series[seriesIndex] ? series[seriesIndex][dataPointIndex] : null
            const date = w && w.globals && w.globals.categoryLabels ? w.globals.categoryLabels[dataPointIndex] : ''
            if (val == null) return ''
            const amount = `${Number(val).toFixed(2)} €`
            const lines = [`<div style="font-weight:600;font-size:12px;margin-bottom:2px;">${amount}</div>`,
                           `<div style=\"font-size:11px;opacity:.8;\">${date}</div>`]
            return `<div style=\"background:#fff;color:#000;padding:8px 10px;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.18);border:1px solid rgba(0,0,0,.06);\">${lines.join('') }</div>`
          }
        },
        dataLabels: { enabled: false }
      }
    }
  },
  methods: {
    getPrimaryColor() {
      try {
        const theme = this.$vuetify.theme
        const mode = theme.dark ? 'dark' : 'light'
        const color = (theme.themes && theme.themes[mode] && theme.themes[mode].primary) || '#1976D2'
        return color
      } catch (e) {
        return '#1976D2'
      }
    }
  }
}
</script>

<style scoped>
</style>

