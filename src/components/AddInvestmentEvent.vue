<template>

  <!-- Loader -->
  <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
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
      <v-app-bar-nav-icon @click="goBack">
        <v-icon>mdi-close</v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>{{ isExistingPosition ? `${actionLabel(presetAction) || 'Add'} · ${positionInfo.assetName}` : 'New Investment' }}</v-toolbar-title>

    </v-app-bar>
    <v-container>
      <v-card>
        <v-card-text>
          <v-form ref="form">

            <!-- Action: locked to BUY for new, selectable for existing -->
            <v-select
              v-if="isExistingPosition"
              v-model="event.action"
              :items="actions"
              item-value="value"
              item-text="label"
              label="Action"
              prepend-icon="mdi-swap-horizontal"
              :rules="requiredRules"
              required
            ></v-select>

            <!-- Asset fields: only shown for new position -->
            <template v-if="!isExistingPosition">
              <v-select
                v-model="event.assetType"
                :items="assetTypes"
                item-value="value"
                item-text="label"
                label="Asset Type"
                prepend-icon="mdi-shape"
                :rules="requiredRules"
                required
              ></v-select>
              <v-text-field
                v-model="event.assetName"
                label="Asset Name"
                prepend-icon="mdi-tag"
                :rules="requiredRules"
                required
              />
              <v-text-field
                v-model="event.symbol"
                label="Symbol (optional)"
                prepend-icon="mdi-alphabetical"
                hint="e.g. AAPL, BTC"
                persistent-hint
              />
            </template>

            <!-- Position info banner for existing -->
            <v-alert v-if="isExistingPosition" type="info" text dense class="mb-4">
              {{ assetTypeLabel(positionInfo.assetType) }} · {{ positionInfo.assetName }}
              <span v-if="positionInfo.symbol"> ({{ positionInfo.symbol }})</span>
              · {{ positionInfo.quantity }} units held
            </v-alert>

            <!-- Units: hidden for YIELD -->
            <v-text-field
              v-if="event.action !== 'YIELD'"
              v-model.number="event.units"
              type="number"
              step="any"
              min="0"
              :label="event.action === 'SELL' ? 'Units to Sell' : 'Units to Buy'"
              prepend-icon="mdi-counter"
              :rules="unitsRules"
              required
            />
            <v-currency-field
              v-model="event.unitPriceAmount"
              :label="event.action === 'YIELD' ? 'Yield Amount' : 'Unit Price'"
              :prepend-icon="event.action === 'YIELD' ? 'mdi-cash-plus' : 'mdi-currency-eur'"
              :rules="amountRules"
              required
              suffix="€"
            />
            <v-currency-field
              v-model="event.feeAmount"
              label="Fee (optional)"
              prepend-icon="mdi-cash-minus"
              suffix="€"
            />
            <v-text-field
              v-model="event.description"
              :counter="32"
              label="Description (optional)"
              prepend-icon="mdi-text"
              :rules="descriptionRules"
            />
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="event.date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="event.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="event.date"
                scrollable
                first-day-of-week="1"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="modal = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(event.date)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>

            <!-- Wallet: only for new position -->
            <v-select
              v-if="!isExistingPosition"
              v-model="event.wallet"
              :items="wallets"
              item-text="name"
              item-value="_id"
              label="Wallet"
              prepend-icon="mdi-wallet"
              :rules="requiredRules"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createEvent">
            {{ isExistingPosition ? `Add ${actionLabel(event.action)}` : 'Create Position' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import {useSnackbarStore} from '@/store/snackbar'
import {useWalletStore} from "~/store/wallet";

export default {
  name: "AddInvestmentEvent",
  data() {
    return {
      modal: false,
      assetTypes: [],
      actions: [],
      positionInfo: {},
      event: {
        action: "BUY",
        assetType: "",
        assetName: "",
        symbol: "",
        units: null,
        unitPriceAmount: 0,
        feeAmount: 0,
        description: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
        wallet: "",
      },
      requiredRules: [
        v => !!v || "Required Field",
      ],
      amountRules: [
        v => !!v || "Required Field",
      ],
      unitsRules: [
        v => (v !== null && v !== '' && v > 0) || "Units must be greater than 0",
      ],
      descriptionRules: [
        v => !v || v.length <= 32 || "Max 32 characters"
      ],
    }
  },
  computed: {
    wallets: () => useWalletStore().wallets,
    current: () => useWalletStore().current,
    snackbar: () => useSnackbarStore(),
    loading: () => useWalletStore().getLoading,
    isExistingPosition() {
      return !!this.$route.query.positionId
    },
    presetAction() {
      return this.$route.query.action || null
    }
  },
  async mounted() {
    await this.loadTypes()
    await this.prefill()
  },
  methods: {
    goBack() {
      this.$nuxt.context.from ? this.$router.back() : this.$router.push('/')
    },
    async prefill() {
      const q = this.$route.query
      if (q.positionId) {
        try {
          this.positionInfo = await this.$axios.$get(
            `/investments/position/${q.positionId}`,
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          )
          this.event.wallet = this.positionInfo.accountID
        } catch (err) {
          console.log(err)
        }
        if (q.action) this.event.action = q.action
      } else {
        if (this.current) this.event.wallet = this.current._id
      }
    },
    async loadTypes() {
      try {
        const res = await this.$axios.$get(
          `/investments/types`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        )
        this.assetTypes = res.assetTypes || []
        this.actions = res.actions || []
      } catch (err) {
        console.log(err)
      }
    },
    assetTypeLabel(value) {
      const found = this.assetTypes.find(t => t.value === value)
      return found ? found.label : value
    },
    actionLabel(value) {
      const found = this.actions.find(a => a.value === value)
      return found ? found.label : value || 'Event'
    },
    async createEvent() {
      if (this.$refs.form.validate()) {
        const body = {
          userID: this.$auth.user._id,
          accountID: this.isExistingPosition ? this.positionInfo.accountID : this.event.wallet,
          action: this.event.action,
          date: new Date(this.event.date).toISOString().split("T")[0],
          units: this.event.action !== 'YIELD' ? this.event.units : undefined,
          unitPriceAmount: this.event.unitPriceAmount,
          feeAmount: this.event.feeAmount || undefined,
          description: this.event.description || undefined,
        }
        if (this.isExistingPosition) {
          body.positionID = this.$route.query.positionId
        } else {
          body.assetType = this.event.assetType
          body.assetName = this.event.assetName
          body.symbol = this.event.symbol || undefined
        }
        try {
          await this.$axios.post(
            `/investments`,
            body,
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          )
          this.snackbar.displayPrimary("Investment event created")
          this.goBack()
        } catch (err) {
          this.snackbar.displayError(err.response?.data?.message || "Error")
        }
      } else {
        this.snackbar.displayError("Form not valid")
      }
    }
  }
}
</script>

<style scoped>

</style>
