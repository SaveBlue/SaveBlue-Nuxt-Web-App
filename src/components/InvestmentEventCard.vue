<template>
  <v-card class="mx-auto" hover @click="openEdit">
    <v-card-title class="pb-0">
      <v-chip small :color="actionColor" dark>{{ actionLabel }}</v-chip>
      <v-chip v-if="isBackdated" x-small outlined class="ml-2">Latest entry</v-chip>
      <v-spacer/>
      <v-btn
        v-if="isLatest"
        icon
        small
        color="error"
        @click.stop="showUndo = true"
      >
        <v-icon small>mdi-undo</v-icon>
      </v-btn>
    </v-card-title>
    <div class="d-flex flex-no-wrap justify-space-between">
      <v-card-subtitle class="align-self-center py-1">
        {{ event.date.split("T")[0] }}
        <span v-if="event.action !== 'YIELD'"> · {{ event.units }} @ {{ (event.unitPriceAmount / 100).toFixed(2) }} €</span>
      </v-card-subtitle>
      <v-card-title class="align-self-center py-1">
        {{ (totalAmount / 100).toFixed(2) }} €
      </v-card-title>
    </div>
    <v-card-text v-if="event.feeAmount" class="pt-0 pb-1">
      Fee: {{ (event.feeAmount / 100).toFixed(2) }} €
    </v-card-text>
    <v-card-text v-if="event.description" class="pt-0 pb-1">{{ event.description }}</v-card-text>
    <v-card-text v-if="event.action === 'SELL' && event.realizedPnLAmount" class="pt-0">
      Realized P&L:
      <span :class="event.realizedPnLAmount >= 0 ? 'green--text' : 'red--text'">
        {{ event.realizedPnLAmount >= 0 ? '+' : '' }}{{ (event.realizedPnLAmount / 100).toFixed(2) }} €
      </span>
    </v-card-text>

    <!-- Undo Dialog -->
    <v-dialog v-model="showUndo" max-width="400" persistent>
      <v-card>
        <v-card-title>Undo This Event?</v-card-title>
        <v-card-text>
          This will reverse the financial effect of this <strong>{{ actionLabel }}</strong> event
          from {{ event.date.split("T")[0] }} and restore the account balance to its previous state.
          <br><br>
          <span class="caption grey--text">Only the most recently created event can be undone.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showUndo = false">Cancel</v-btn>
          <v-btn color="error" text @click="showUndo = false; $emit('delete', event._id)">Undo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="showEdit" max-width="400" persistent>
      <v-card>
        <v-card-title>Edit Event</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editDescription"
            label="Description"
            :counter="32"
            prepend-icon="mdi-text"
          />
          <v-dialog
            ref="editDateDialog"
            v-model="editDateModal"
            :return-value.sync="editDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="editDate"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="editDate" scrollable first-day-of-week="1">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="editDateModal = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.editDateDialog.save(editDate)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <div class="caption grey--text mt-2">
            Changing the date affects display order only. To correct financial details, undo this event and create a new one.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showEdit = false">Cancel</v-btn>
          <v-btn color="primary" text @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const ACTION_LABELS = { BUY: 'Buy', SELL: 'Sell', YIELD: 'Yield' }

export default {
  name: "InvestmentEventCard",
  data() {
    return {
      showUndo: false,
      showEdit: false,
      editDateModal: false,
      editDescription: '',
      editDate: '',
    }
  },
  props: {
    event: Object,
    isLatest: {
      type: Boolean,
      default: false
    },
    isBackdated: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    actionLabel() {
      return ACTION_LABELS[this.event.action] || this.event.action
    },
    actionColor() {
      switch (this.event.action) {
        case 'BUY': return 'green'
        case 'SELL': return 'red'
        case 'YIELD': return 'amber darken-2'
        default: return 'grey'
      }
    },
    totalAmount() {
      if (this.event.action === 'YIELD') {
        return this.event.unitPriceAmount
      }
      return this.event.units * this.event.unitPriceAmount + (this.event.feeAmount || 0)
    }
  },
  methods: {
    openEdit() {
      this.editDescription = this.event.description || ''
      this.editDate = this.event.date.split("T")[0]
      this.showEdit = true
    },
    saveEdit() {
      this.showEdit = false
      this.$emit('edit', {
        id: this.event._id,
        description: this.editDescription,
        date: this.editDate,
      })
    }
  }
}
</script>

<style scoped>

</style>
