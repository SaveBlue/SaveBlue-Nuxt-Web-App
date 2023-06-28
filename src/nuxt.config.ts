// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
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
        '@vite-pwa/nuxt'
    ],

    pwa: {
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        workbox: {
            navigateFallback: '/',
        },
        devOptions: {
            enabled: true,
            type: 'module'
        },
        manifest: {
            name: "SaveBlue",
            short_name: "SaveBlue",
            description: "Finance management app",
            start_url: "/",
            display: "standalone",
            background_color: "#1976d2",
            icons: [
                {
                    src: 'pwa/pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png'
                },
                {
                    src: 'pwa/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png'
                },
                {
                    src: 'pwa/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: 'pwa/pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ],
            shortcuts: [
                {
                    name: "Add Income",
                    short_name: "Add Income",
                    description: "Add new income to a wallet",
                    url: "/income/add",
                    icons: [
                        {
                            src: 'pwa/income.png',
                            sizes: "192x192",
                            type: "image/png"
                        }
                    ]
                },
                {
                    name: "Add Expense",
                    short_name: "Add Expense",
                    description: "Add new expense to a wallet",
                    url: "/expense/add",
                    icons: [
                        {
                            src: 'pwa/expense.png',
                            sizes: "192x192",
                            type: "image/png"
                        }
                    ]
                }
            ]
        }
    },

    runtimeConfig: {
        public: {
            baseApiUrl: 'http://localhost:5000/api',
        }
    },

    build: {
        transpile: ["vuetify"],
    },
})
