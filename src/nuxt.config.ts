// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
      head: {
          titleTemplate: '%s - SaveBlue',
          title: 'SaveBlue',
          meta: [
              {charset: 'utf-8'},
              {name: 'viewport', content: 'width=device-width, initial-scale=1'},
              {name: 'format-detection', content: 'telephone=no'}
          ],
          link: [
              {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
          ]
      }
  },

  css: [
      "vuetify/lib/styles/main.sass",
      "@mdi/font/css/materialdesignicons.min.css"
  ],

  modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
  ],

  runtimeConfig:{
      public: {
          baseApiUrl: 'http://localhost:5000',
      }
  },

  build: {
      transpile: ["vuetify"],
  },

  devtools: {
    enabled: false,
  },
})
