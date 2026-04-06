<template>

  <!-- Loader -->
  <v-row align="center" justify="center" v-if="!position" style="height: 100vh">
    <v-col cols="2">
      <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
    </v-col>
  </v-row>

  <!-- Content -->
  <div v-else>
    <v-app-bar
      fixed
      color="primary"
      dark
      app
    >
      <v-app-bar-nav-icon @click="$router.back()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ position.assetName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!position.closed" icon @click="showPriceDialog = true">
        <v-icon>mdi-currency-usd</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container>
      <v-row align="center" justify="center">
        <!-- Position Summary -->
        <v-col cols="12">
          <v-card class="text-center">
            <v-card-title class="justify-center pb-0">
              {{ position.assetName }}
              <v-chip x-small class="ml-2" outlined>{{ assetTypeLabel(position.assetType) }}</v-chip>
              <v-chip v-if="position.symbol" x-small class="ml-1" outlined>{{ position.symbol }}</v-chip>
              <v-chip v-if="position.closed" x-small class="ml-1" color="grey" dark>CLOSED</v-chip>
            </v-card-title>

            <v-card-text>
              <!-- Headline: market value + unrealized P&L -->
              <h1>{{ (marketValue / 100).toFixed(2) }} €</h1>
              <div class="caption grey--text">Market Value</div>
              <div class="subtitle-1 mt-1" :class="unrealizedPnL >= 0 ? 'green--text' : 'red--text'">
                {{ unrealizedPnL >= 0 ? '+' : '' }}{{ (unrealizedPnL / 100).toFixed(2) }} €
                ({{ position.totalCostAmount ? ((unrealizedPnL / position.totalCostAmount) * 100).toFixed(1) : '0.0' }}%)
              </div>
              <div class="caption grey--text">Unrealized P&L</div>

              <v-divider class="my-3"/>

              <!-- Position details -->
              <v-row dense>
                <v-col cols="6">
                  <div class="caption grey--text">Quantity</div>
                  <div class="subtitle-1">{{ position.quantity }}</div>
                </v-col>
                <v-col cols="6">
                  <div class="caption grey--text">Current Price</div>
                  <div class="subtitle-1">{{ (position.currentUnitPriceAmount / 100).toFixed(2) }} €</div>
                </v-col>
                <v-col cols="6">
                  <div class="caption grey--text">Total Cost</div>
                  <div class="subtitle-1">{{ (position.totalCostAmount / 100).toFixed(2) }} €</div>
                </v-col>
                <v-col cols="6">
                  <div class="caption grey--text">Avg Cost / Unit</div>
                  <div class="subtitle-1">{{ (avgCostPerUnit / 100).toFixed(2) }} €</div>
                </v-col>
              </v-row>

              <!-- Returns & costs (only when there's something to show) -->
              <template>
                <v-divider class="my-3"/>
                <v-row dense>
                  <v-col cols="6">
                    <div class="caption grey--text">{{ yieldLabel }}</div>
                    <div class="subtitle-1 green--text">{{ (position.totalYieldAmount / 100).toFixed(2) }} €</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="caption grey--text">Realized P&L</div>
                    <div class="subtitle-1" :class="position.realizedPnLAmount >= 0 ? 'green--text' : 'red--text'">
                      {{ position.realizedPnLAmount >= 0 ? '+' : '' }}{{ (position.realizedPnLAmount / 100).toFixed(2) }} €
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="caption grey--text">Total Fees</div>
                    <div class="subtitle-1">{{ (position.totalFeesAmount / 100).toFixed(2) }} €</div>
                  </v-col>
                </v-row>
              </template>

              <div class="caption grey--text mt-3">
                Opened: {{ position.openedAt.split("T")[0] }}
                <span v-if="position.closedAt"> · Closed: {{ position.closedAt.split("T")[0] }}</span>
              </div>
            </v-card-text>

            <v-menu offset-y left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon absolute top right v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="openEditDialog">
                  <v-list-item-icon class="mr-2"><v-icon small>mdi-pencil</v-icon></v-list-item-icon>
                  <v-list-item-title>Edit Info</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showDeletePositionDialog = true">
                  <v-list-item-icon class="mr-2"><v-icon small color="error">mdi-delete</v-icon></v-list-item-icon>
                  <v-list-item-title class="error--text">Remove Position</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card>
        </v-col>

        <!-- Event History Header -->
        <v-col cols="12" class="pb-0">
          <div class="d-flex align-center justify-space-between">
            <span class="subtitle-1 font-weight-medium">Event History</span>
          </div>
        </v-col>

        <!-- Events List -->
        <v-col class="py-1" cols="12" v-for="(ev, index) in events" :key="ev._id">
          <InvestmentEventCard :event="ev" :isLatest="ev._id === latestEventId" :isBackdated="ev._id === latestEventId && index > 0" @delete="deleteEvent" @edit="editEvent"/>
        </v-col>
        <v-col class="text-center" v-intersect="infiniteScrollingEvents">
          <v-progress-circular class="py-2" color="primary" indeterminate v-if="!stopLoadingEvents"/>
        </v-col>
      </v-row>
    </v-container>

    <!-- Action Speed Dial -->
    <v-speed-dial
      v-if="!position.closed"
      v-model="fab"
      bottom
      right
      direction="top"
      transition="slide-y-reverse-transition"
      fixed
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="accent" dark fab>
          <v-icon class="toggleUpDown" :class='{ "rotate": fab }'>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" :to="actionRoute('BUY')">
        <v-icon>mdi-cart-plus</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" :to="actionRoute('SELL')">
        <v-icon>mdi-cart-minus</v-icon>
      </v-btn>
      <v-btn fab dark small color="amber darken-2" :to="actionRoute('YIELD')">
        <v-icon>mdi-cash-plus</v-icon>
      </v-btn>
    </v-speed-dial>

    <!-- Edit Position Dialog -->
    <v-dialog v-model="showEditPositionDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Edit Position</v-card-title>
        <v-card-text>
          <v-text-field v-model="editFields.assetName" label="Asset Name"/>
          <v-text-field v-model="editFields.symbol" label="Symbol"/>
          <v-select v-model="editFields.assetType" :items="assetTypes" item-value="value" item-text="label" label="Asset Type"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showEditPositionDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="editPosition">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Position Dialog -->
    <v-dialog v-model="showDeletePositionDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="error--text">Delete Entire Position?</v-card-title>
        <v-card-text>
          This will permanently remove <strong>{{ position.assetName }}</strong> and revert
          <strong>all {{ events.length }} event{{ events.length !== 1 ? 's' : '' }}</strong>
          associated with it. Account balances will be restored to their state before this position existed.
          <br><br>
          <strong>This action cannot be undone.</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showDeletePositionDialog = false">Cancel</v-btn>
          <v-btn color="error" text @click="deletePosition">Delete Position</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Price Dialog -->
    <v-dialog v-model="showPriceDialog" max-width="400" persistent>
      <v-card>
        <v-card-title>Update Current Price</v-card-title>
        <v-card-text>
          <v-currency-field
            v-model="newPrice"
            label="New Unit Price"
            prepend-icon="mdi-currency-eur"
            suffix="€"
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showPriceDialog = false">Cancel</v-btn>
          <v-btn color="primary" text @click="updatePrice">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {useSnackbarStore} from '@/store/snackbar'

export default {
  layout: 'empty',
  data() {
    return {
      position: null,
      events: [],
      eventsPageCounter: 0,
      stopLoadingEvents: false,
      fab: false,
      showPriceDialog: false,
      showDeletePositionDialog: false,
      showEditPositionDialog: false,
      newPrice: 0,
      editFields: { assetName: '', symbol: '', assetType: '' },
      assetTypes: [],
    }
  },
  computed: {
    snackbar: () => useSnackbarStore(),
    marketValue() {
      return this.position ? this.position.quantity * this.position.currentUnitPriceAmount : 0
    },
    avgCostPerUnit() {
      return this.position && this.position.quantity > 0
        ? this.position.totalCostAmount / this.position.quantity
        : 0
    },
    unrealizedPnL() {
      return this.marketValue - (this.position ? this.position.totalCostAmount : 0)
    },
    yieldLabel() {
      if (!this.position) return 'Yield Earned'
      switch (this.position.assetType) {
        case 'STOCK': case 'ETF': case 'MUTUAL_FUND': return 'Dividends Earned'
        case 'SAVINGS_ACCOUNT': case 'FIXED_TERM_DEPOSIT': return 'Interest Earned'
        case 'BOND': return 'Coupons Earned'
        case 'REAL_ESTATE': return 'Rent Earned'
        default: return 'Yield Earned'
      }
    },
    latestEventId() {
      if (!this.events.length) return null
      return this.events.reduce((max, ev) => ev._id > max ? ev._id : max, this.events[0]._id)
    }
  },
  async mounted() {
    try {
      await this.loadPosition()
      await this.loadEvents()
      this.loadTypes()
    } catch (err) {
      console.log(err)
      this.snackbar.displayError("Failed to load position")
    }
  },
  methods: {
    assetTypeLabel(value) {
      const found = this.assetTypes.find(t => t.value === value)
      return found ? found.label : value
    },
    actionRoute(action) {
      return `/investment/add?positionId=${this.position._id}&action=${action}`
    },
    openEditDialog() {
      this.editFields = {
        assetName: this.position.assetName,
        symbol: this.position.symbol || '',
        assetType: this.position.assetType,
      }
      this.showEditPositionDialog = true
    },
    async editPosition() {
      try {
        const res = await this.$axios.$put(
          `/investments/position/${this.position._id}`,
          this.editFields,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.position = res
        this.showEditPositionDialog = false
        this.snackbar.displaySuccess("Position updated")
      } catch (err) {
        this.snackbar.displayError(err.response?.data?.message || "Error updating position")
      }
    },
    async loadTypes() {
      try {
        const res = await this.$axios.$get(
          `/investments/types`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.assetTypes = res.assetTypes || []
      } catch (err) {
        console.log(err)
      }
    },
    async loadPosition() {
      this.position = await this.$axios.$get(
        `/investments/position/${this.$route.params.id}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      )
      this.newPrice = this.position.currentUnitPriceAmount
    },
    async loadEvents() {
      try {
        this.events = await this.$axios.$get(
          `/investments/events/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        if (this.events.length < 16) this.stopLoadingEvents = true
      } catch (err) {
        console.log(err)
        this.stopLoadingEvents = true
      }
    },
    infiniteScrollingEvents(entries, observer, isIntersecting) {
      if (isIntersecting && !this.stopLoadingEvents) {
        this.eventsPageCounter++
        this.$axios.$get(
          `/investments/events/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}, params: {page: this.eventsPageCounter}}
        ).then(response => {
          if (response.length > 0) {
            response.forEach(item => this.events.push(item))
          } else {
            this.stopLoadingEvents = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    async updatePrice() {
      try {
        const res = await this.$axios.$put(
          `/investments/position/price/${this.position._id}`,
          {currentUnitPriceAmount: this.newPrice},
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.position = res
        this.showPriceDialog = false
        this.snackbar.displaySuccess("Price updated")
      } catch (err) {
        this.snackbar.displayError(err.response?.data?.message || "Error updating price")
      }
    },
    async deletePosition() {
      try {
        await this.$axios.$delete(
          `/investments/position/${this.position._id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.showDeletePositionDialog = false
        this.snackbar.displayPrimary("Position removed")
        this.$router.back()
      } catch (err) {
        this.snackbar.displayError(err.response?.data?.message || "Error removing position")
      }
    },
    async editEvent({ id, description, date }) {
      try {
        const res = await this.$axios.$put(
          `/investments/${id}`,
          { description, date },
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        const idx = this.events.findIndex(e => e._id === id)
        if (idx !== -1) this.$set(this.events, idx, res)
        this.snackbar.displaySuccess("Event updated")
      } catch (err) {
        this.snackbar.displayError(err.response?.data?.message || "Error updating event")
      }
    },
    async deleteEvent(eventId) {
      try {
        await this.$axios.$delete(
          `/investments/${eventId}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.snackbar.displayPrimary("Event undone")
        this.stopLoadingEvents = true
        this.eventsPageCounter = 0
        this.events = []
        try {
          await this.loadPosition()
          await this.loadEvents()
          if (this.events.length === 0) {
            this.snackbar.displayPrimary("Position has no events left")
            this.$router.back()
          }
        } catch {
          this.snackbar.displayPrimary("Position removed")
          this.$router.back()
        }
      } catch (err) {
        this.snackbar.displayError(err.response?.data?.message || "Error deleting event")
      }
    }
  }
}
</script>

<style scoped>
.toggleUpDown {
  transition: transform .3s ease-in-out !important;
}
.toggleUpDown.rotate {
  transform: rotate(45deg);
}
</style>
