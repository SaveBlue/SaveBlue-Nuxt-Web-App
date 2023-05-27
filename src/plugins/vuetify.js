import { createVuetify} from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'

const themeLight = {
    dark: false,
    colors: {
        primary: colors.blue.darken2,
        accent: colors.amber.accent3,
        secondary: colors.lightBlue.lighten2,
        info: colors.grey.lighten3,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.blue.base

    }
}

const themeDark = {
    dark: true,
    colors: {
        primary: colors.blue.darken2,
        accent: colors.amber.accent3,
        secondary: colors.lightBlue.lighten2,
        info: colors.grey.base,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.blue.base
    }
}

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        theme:{
            defaultTheme: "themeLight",
            themes: {
                themeLight,
                themeDark
            }
        }
    })
    nuxtApp.vueApp.use(vuetify)
})