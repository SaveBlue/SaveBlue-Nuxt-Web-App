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
      <!--<v-app-bar-nav-icon @click="current ? $router.back() : $router.push('/')">-->
      <v-app-bar-nav-icon @click="($nuxt.context.from.path.includes('wallet') || $nuxt.context.from.path.includes('drafts')) ? $router.back() : $router.push('/')">
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
              :rules="applyRules ? amountRules : []"
              label="Amount"
              prepend-icon="mdi-currency-eur"
              required
              suffix="€"
            />
            <div v-if="isExpense">
              <v-select
                v-model="incomeExpense.category1"
                :items="categoriesExpense.map(c => c.category1)"
                label="Primary Category"
                prepend-icon="mdi-numeric-1-circle-outline"
                :rules="requiredRules"
                required
              ></v-select>
              <v-select
                v-if="isExpense"
                v-model="incomeExpense.category2"
                :disabled="!incomeExpense.category1"
                :items="incomeExpense.category1 ? categoriesExpense.filter(c => c.category1 === incomeExpense.category1)[0].category2 : []"
                label="Secondary Category"
                prepend-icon="mdi-numeric-2-circle-outline"
                :rules="requiredRules"
                required
              ></v-select>
            </div>
            <div v-else>
              <v-select
                v-model="incomeExpense.category1"
                :items="categoriesIncome.map(c => c.category1)"
                label="Primary Category"
                prepend-icon="mdi-numeric-1-circle-outline"
                :rules="requiredRules"
                required
              ></v-select>
            </div>
            <v-text-field
              v-model="incomeExpense.description"
              :counter="32"
              label="Description"
              prepend-icon="mdi-text"
              :rules="descriptionRules"
            />
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
                  label="Date"
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
            <v-select
              v-model="incomeExpense.wallet"
              :items="wallets.map(w => w.name)"
              label="Wallet"
              prepend-icon="mdi-wallet"
              :rules="requiredRules"
            ></v-select>
            <v-file-input
              v-model="incomeExpense.image"
              accept="image/png, image/jpeg, image/jpg"
              label="Receipt Image"
              prepend-icon="mdi-image-plus"
              truncate-length="32"
              chips
            />
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
  </div>
</template>

<script>
import {useSnackbarStore} from '@/store/snackbar'
import {useCategoryStore} from "~/store/category";
import {useWalletStore} from "~/store/wallet";
import Compressor from 'compressorjs';

export default {
  name: "add-income-expense",
  data() {
    return {
      modal: false,
      modal2: false,
      //loading: this.edit,
      incomeExpense: {
        amount: 0,
        category1: "",
        category2: "",
        description: "",
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
        wallet: "",
      },
      applyRules: false,
      //accounts: [],
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
    }
  },
  props: {
    edit: Boolean,
    isExpense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    wallets: () => useWalletStore().wallets,
    current: () => useWalletStore().current,
    snackbar: () => useSnackbarStore(),
    categoriesIncome: () => useCategoryStore().income,
    categoriesExpense: () => useCategoryStore().expense,
    loading: () => (useCategoryStore().getLoading || useCategoryStore().getLoading),
  },
  /*created() {
    //this.incomeExpense.amount = this.amount
  },*/
  async fetch() {

    // Handle route changes
    if (!this.loading) {
      await this.loadData()
    }
  },
  watch: {
    // Handle page refreshes
    async loading(newValue, oldValue) {
      await this.loadData()
    }
  },
  methods: {
    compressImage(image) {
      return new Promise((resolve, reject) => {
        new Compressor(image, {
          quality: 0.6, // Adjust compression quality as needed
          convertSize: 512000, // Convert to JPEG if size exceeds 0.5MB (value in bytes)
          maxHeight: 720, // Limit image height to 720px
          maxWidth: 720, // Limit image width to 720px
          success: (compressedResult) => {
            // Convert compressed blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(compressedResult);
            reader.onloadend = () => {
              resolve(reader.result.split(",")[1]); // Resolve the promise with the base64 string
            };
            reader.onerror = (error) => {
              reject(error); // Reject the promise if there's an error reading the file
            };
          },
          error(err) {
            reject(err); // Reject the promise if compression fails
          },
        });
      });
    },
    async loadData(){
      if (this.edit) {
        this.applyRules = false
        await this.$axios.$get(
          `/${this.isExpense ? 'expenses' : 'incomes'}/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(response => {
          this.incomeExpense = response
          // Handle Drafts
          if (this.incomeExpense.category1 === "Draft"){
            this.incomeExpense.category1 = "";
            (this.incomeExpense.category2) && (this.incomeExpense.category2 = "")
          }
          const walletFromList = this.wallets.find((w) => w._id === this.incomeExpense.accountID)
          this.incomeExpense.wallet = walletFromList ? walletFromList.name : ""
          this.incomeExpense.date = this.incomeExpense.date.split("T")[0]
          this.applyRules = true
        })
      } else {
        (typeof this.current !== "undefined") && (this.incomeExpense.wallet = this.current.name)
      }
    },
    async createIncomeExpense() {
      if (this.$refs.form.validate() && typeof this.incomeExpense.amount !== 'undefined') {
        this.incomeExpense.accountID = (this.wallets.find((w) => w.name === this.incomeExpense.wallet))._id
        //this.incomeExpense.amount = parseInt(this.incomeExpense.amount.replace(".", ""))
        this.incomeExpense.date = new Date(this.incomeExpense.date).toISOString().split("T")[0]
        this.incomeExpense.userID = this.$auth.user._id
        this.incomeExpense.image = this.incomeExpense.image ? await this.compressImage(this.incomeExpense.image) : null
        //console.log(this.incomeExpense.image)
        try {
          await this.$axios.post(
            `/${this.isExpense ? 'expenses' : 'incomes'}/`,
            this.incomeExpense,
            {headers: {"x-access-token": this.$auth.strategy.token.get()}}
          ).then(
            () => {
              this.snackbar.displayPrimary("Created")
              this.current ? this.$router.back() : this.$router.push('/')
            }
          )
        } catch {
          this.snackbar.displayError("Error")
        }
        finally {
          this.incomeExpense.image = undefined
        }
      } else {
        this.snackbar.displayError("Form not valid")
      }
    }
    ,
    async updateIncomeExpense() {
      if (this.$refs.form.validate()){
        this.incomeExpense.accountID = (this.wallets.find((w) => w.name === this.incomeExpense.wallet))._id
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
              this.snackbar.displaySuccess("Updated");
              (this.current || this.$nuxt.context.from.path.includes('drafts')) ? this.$router.back() : this.$router.push('/')
            }
          )
        } catch {
          this.snackbar.displayError("Error")
        }
      }
      else {
        this.snackbar.displayError("Form not valid")
      }
    }
    ,
    async deleteIncomeExpense() {
      try {
        await this.$axios.delete(
          `/${this.isExpense ? 'expenses' : 'incomes'}/${this.$route.params.id}`,
          {headers: {"x-access-token": this.$auth.strategy.token.get()}}
        ).then(
          () => {
            this.snackbar.displayPrimary("Deleted")
            this.$router.back()
          }
        )
      } catch {
        this.snackbar.displayError("Error")
      }
    }
  }
  ,
}
</script>

<style scoped>

</style>
