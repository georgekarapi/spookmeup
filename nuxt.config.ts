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
    hooks: {
        'nitro:build:before': nitro => {
            nitro.hooks.hook('compiled', async () => {
                const fs = await import('fs')
                const path = await import('path')
                const outputPath = path.join(nitro.options.output.serverDir, 'package.json')
                const packageJson = JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
                packageJson.dependencies['cbw-sdk'] = 'npm:@coinbase/wallet-sdk@3.9.3'
                fs.writeFileSync(outputPath, JSON.stringify(packageJson, null, 2))

                const npmrcPath = path.join(nitro.options.output.serverDir, '.npmrc')
                fs.writeFileSync(npmrcPath, 'legacy-peer-deps=true')
            })
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
            gen: 2,
            nodeVersion: '20'
        }
    }
})
