// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    css: ['@/assets/styles/app.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api']
                }
            }
        }
    },
    runtimeConfig: {
        storachaKey: process.env.STORACHA_KEY,
        storachaProof: process.env.STORACHA_PROOF,
        public: {
            apiBaseUrl: process.env.API_BASE_URL,
            ipfsHash: process.env.IPFS_HASH
        }
    },
    colorMode: {
        preference: 'light'
    },
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxt/icon'],
    nitro: {
        firebase: {
            gen: 2
        }
    }
})
