import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  target: 'static',
  ssr: false,

  generate: {
    fallback: true
  },

  router: {
    middleware: ['auth']
  },
  loadingIndicator: {
    background: colors.blue.darken2,
    color: colors.grey.lighten1
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - src',
    title: 'SaveBlue',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/apexcharts.js', mode: 'client'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    ['v-currency-field/nuxt-treeshaking', {
      locale: 'sl-SI',
      decimalLength: 2,
      autoDecimalMode: true,
      min: 0.00,
      max: 1000000.00,
      defaultValue: 0,
      valueAsInteger: true,
      allowNegative: false
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NODE_ENV === 'dev' ? 'http://localhost:5000/api' : process.env.BASE_URL,
  },

  auth: {
    strategies: {
      local: {
        token: {
          name: 'x-access-token',
          property: 'x-access-token',
          type: ''
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: {url: '/auth/login', method: 'post'},
          logout: {url: '/auth/logout', method: 'post'},
          user: {url: '/users/me', method: 'get'}
        }
      }
    },
    redirect: {
      logout: '/login',
      home: '/'
    },
    rewriteRedirects: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      source: 'icon.png'
    },
    meta: {
      theme_color: colors.blue.darken2
    },
    manifest: {
      name: 'SaveBlue',
      short_name: 'SaveBlue',
      lang: 'en',
      background_color: colors.blue.darken2,
      shortcuts: [
        {
          name: "Add Income",
          short_name: "Add Income",
          description: "Add new income to an account",
          url: "/income/add",
          icons: [
            {
              src: '/_nuxt/icons/icon_192x192.33a624.png',
              sizes: "192x192",
              type: "image/png"
            }
          ]
        },
        {
          name: "Add Expense",
          short_name: "Add Expense",
          description: "Add new expense to an account",
          url: "/expense/add",
          icons: [
            {
              src: '/_nuxt/icons/icon_192x192.33a624.png',
              sizes: "192x192",
              type: "image/png"
            }
          ]
        }
      ]
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.amber.accent3,
          secondary: colors.lightBlue.lighten2,
          info: colors.grey.lighten3,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.blue
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.amber.accent3,
          secondary: colors.lightBlue.lighten2,
          info: colors.grey,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.blue
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
