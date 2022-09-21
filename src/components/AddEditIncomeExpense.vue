<template>
  <div>
    <!-- progress loader -->
    <v-row align="center" justify="center" v-if="loading" style="height: 100vh">
      <v-col cols="2">
        <v-progress-circular size="50" color="primary" indeterminate class="ma-auto"/>
      </v-col>
    </v-row>
    <div v-else>
      <v-app-bar
        fixed
        color="primary"
        dark
        app
      >
        <v-app-bar-nav-icon @click="$nuxt.context.from.path === `/${$props.isExpense ? 'expense' : 'income'}/add` ? $router.push('/') : $router.back()">
          <v-icon>mdi-close</v-icon>
        </v-app-bar-nav-icon>

        <v-toolbar-title>
          <span v-if="edit">Edit</span>
          <span v-else>Add</span>
          <span v-if="isExpense">Expense</span>
          <span v-else>Income</span>
        </v-toolbar-title>

      </v-app-bar>
      <v-container>
        <v-card>
          <v-card-text>
            <v-form ref="form">
              <v-currency-field
                v-model="incomeExpense.amount"
                :rules="amountRules"
                label="Amount"
                required
                suffix="€"
              />
              <h3>Categories</h3>
              <div v-if="isExpense">
                <v-select
                  v-model="incomeExpense.category1"
                  :items="primaryCategoriesExpense"
                  label="Primary Category"
                  :rules="requiredRules"
                  required
                ></v-select>
                <v-select
                  v-show="isExpense"
                  v-model="incomeExpense.category2"
                  :items="incomeExpense.category1 === 'Personal' ? secondaryCategories1 : incomeExpense.category1 === 'Food & Drinks' ? secondaryCategories2 : incomeExpense.category1 === 'Home & Utilities' ? secondaryCategories3 : incomeExpense.category1 === 'Transport' ? secondaryCategories4 : incomeExpense.category1 === 'Leisure' ? secondaryCategories5 : incomeExpense.category1 === 'Health' ? secondaryCategories6 : incomeExpense.category1 === 'Finance' ? secondaryCategories7 : []"
                  label="Secondary Category"
                  :rules="requiredRules"
                  required
                ></v-select>
              </div>
              <div v-else>
                <v-select
                  v-model="incomeExpense.category1"
                  :items="primaryCategoriesIncome"
                  label="Primary Category"
                  :rules="requiredRules"
                  required
                ></v-select>
              </div>
              <v-text-field
                v-model="incomeExpense.description"
                :counter="32"
                label="Description"
                :rules="descriptionRules"
              />
              <h3>Date</h3>
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="incomeExpense.date"
                persistent
                width="290px"
                :rules="requiredRules"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="incomeExpense.date"
                    label="Picker in dialog"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="incomeExpense.date"
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
                    @click="$refs.dialog.save(incomeExpense.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <h3>Account</h3>
              <v-select
                v-model="incomeExpense.account"
                :items="accounts.map(a => a.name)"
                label="Account"
                :rules="requiredRules"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="edit" color="primary" @click="updateIncomeExpense">
              <span>Update</span>
              <span v-if="isExpense">&nbspExpense</span>
              <span v-else>&nbspIncome</span>
            </v-btn>
            <v-btn v-else color="primary" @click="createIncomeExpense">
              <span>Add</span>
              <span v-if="isExpense">&nbspExpense</span>
              <span v-else>&nbspIncome</span>
            </v-btn>
          </v-card-actions>
          <v-card-actions v-show="edit">
            <v-btn color="error" @click="deleteIncomeExpense">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar.visible = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "add-income-expense",
  data() {
    return {
      modal: false,
      modal2: false,
      loading: this.edit,
      primaryCategoriesIncome: ["Salary & Wage", "Assets", "Student Work", "Funds Transfer", "Other"],
      primaryCategoriesExpense: ["Personal", "Food & Drinks", "Home & Utilities", "Transport", "Leisure", "Health", "Finance"],
      secondaryCategories1: ["Clothing & Footwear", "Personal Hygiene", "Personal Care Services", "Subscriptions", "Consumer Electronics", "Education"],
      secondaryCategories2: ["Groceries", "Restaurants", "Coffee & Tea", "Alcohol"],
      secondaryCategories3: ["Bills", "Rent", "Household", "Goods", "Maintenance"],
      secondaryCategories4: ["Public transport", "Taxi", "Tolls", "Parking", "Personal vehicle", "Gas"],
      secondaryCategories5: ["Sport", "Entertainment", "Culture", "Holidays"],
      secondaryCategories6: ["Medicine & supplements", "Medical services & diagnostics"],
      secondaryCategories7: ["Insurance", "Taxes", "Debts", "Funds Transfer"],
      //date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      incomeExpense: {
        amount: "",
        category1: "",
        category2: "",
        description: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        account: "",
      },
      accounts: [],
      requiredRules: [
        v => !!v || "Required Field",
      ],
      amountRules: [
        v => !!v || "Required Field",
        //v => +(v.toString().replaceAll(".","").replaceAll(",",".")) > 0  || "Amount must be bigger than 0",
        //v => !!v && +(v.toString().replaceAll(".","").replaceAll(",",".")) < 1000000 || "Number too big",
      ],
      descriptionRules: [
        v => v.length <= 1024 || "Description too long."
      ],
      snackbar: {
        visible: false,
        timeout: 2000,
        color: null,
        text: '',
      },
    }
  },
  props: {
    edit: Boolean,
    isExpense: {
      type: Boolean,
      default: false
    }
  },
  async fetch() {
    await this.$axios.$get(
      `/accounts/${this.$auth.user._id}`,
      {headers: {"x-access-token": this.$auth.strategy.token.get()}}
    ).then(response => {
      this.accounts = response
    })

    if (this.edit) {
      await this.$axios.$get(
        `/${this.isExpense ? 'expenses' : 'incomes'}/${this.$route.params.id}`,
        {headers: {"x-access-token": this.$auth.strategy.token.get()}}
      ).then(response => {
        this.incomeExpense = response
        this.incomeExpense.account = this.accounts.find((acc) => acc._id === this.incomeExpense.accountID).name
        this.incomeExpense.date = this.incomeExpense.date.split("T")[0]
        this.amount = this.incomeExpense.amount.toString();
        //this.incomeExpense.amount = this.incomeExpense.amount
      }).finally(
        () => this.loading = false
      )
    }

  },
  methods: {
    async createIncomeExpense() {
      if (this.$refs.form.validate() && typeof this.incomeExpense.amount !== 'undefined') {
        this.incomeExpense.accountID = (this.accounts.find((acc) => acc.name === this.incomeExpense.account))._id
        //this.incomeExpense.amount = parseInt(this.incomeExpense.amount.replace(".", ""))
        this.incomeExpense.date = new Date(this.incomeExpense.date).toISOString().split("T")[0]
        this.incomeExpense.userID = this.$auth.user._id
        //console.log(this.incomeExpense.amount)
        try {
          await this.$axios.post(
            `/${this.isExpense ? 'expenses' : 'incomes'}/`,
            this.incomeExpense,
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          ).then(
            () => {
              this.$router.back()
            }
          )
        } catch {
          this.snackbar.text = "Error"
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        }
      } else {
        this.snackbar.text = "Form not valid"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    },
    async updateIncomeExpense() {
      this.incomeExpense.accountID = (this.accounts.find((acc) => acc.name === this.incomeExpense.account))._id
      //this.incomeExpense.amount = parseInt(this.incomeExpense.amount.replace(".", ""))
      this.incomeExpense.date = new Date(this.incomeExpense.date).toISOString().split("T")[0]
      //console.log(this.incomeExpense.amount)
      try {
        await this.$axios.put(
          `/${this.isExpense ? 'expenses' : 'incomes'}/${this.$route.params.id}`,
          this.incomeExpense,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.snackbar.text = "Updated"
            this.snackbar.color = "success";
            this.snackbar.visible = true;
          }
        )
      } catch {
        this.snackbar.text = "Error"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    },
    async deleteIncomeExpense() {
      try {
        await this.$axios.delete(
          `/${this.isExpense ? 'expenses' : 'incomes'}/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.$router.back()
          }
        )
      } catch {
        this.snackbar.text = "Error"
        this.snackbar.color = "error";
        this.snackbar.visible = true;
      }
    },
    returnSecondaryCategory() {
      let primary = this.incomeExpense.category1
      switch (primary) {
        case "Personal":
          return this.secondaryCategories1;
        case "Food & Drinks":
          return this.secondaryCategories2;
        case "Home & Utilities":
          return this.secondaryCategories3;
        case "Transport":
          return this.secondaryCategories4;
        case "Leisure":
          return this.secondaryCategories5;
        case "Health":
          return this.secondaryCategories6;
        case "Finance":
          return this.secondaryCategories7;
      }
    }
  },
  created() {
    this.incomeExpense.amount = this.amount
  }
}
</script>

<style scoped>

</style>
