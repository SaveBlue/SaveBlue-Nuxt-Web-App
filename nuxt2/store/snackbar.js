import {defineStore} from 'pinia'

export const useSnackbarStore = defineStore('snackbarStore', {
  state: () => ({
    visible: false,
    timeout: 2000,
    color: "primary",
    text: '',
  }),
  actions: {
    displayPrimary(message) {
      this.visible = true
      this.color = "primary"
      this.text = message
    },
    displaySuccess(message) {
      this.visible = true
      this.color = "success"
      this.text = message
    },
    displayError(message) {
      this.visible = true
      this.color = "error"
      this.text = message
    },
  }
})
