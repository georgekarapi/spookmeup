// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: ['@/assets/styles/app.scss'],
    ssr: false,
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api']
                }
            }
        }
    },
    colorMode: {
        preference: 'light'
    },
    hooks: {
        'prerender:routes'({ routes }) {
            routes.clear() // Do not generate any routes (except the defaults)
        }
    },
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxt/icon']
})
