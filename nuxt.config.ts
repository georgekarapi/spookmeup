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
            if (process.env.NODE_ENV !== 'development') {
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
        }
    },
    vue: {
        compilerOptions: {
            isCustomElement: tag => tag.startsWith('w3m-')
        }
    },
    runtimeConfig: {
        storachaKey: '',
        storachaProof: '',
        public: {
            apiBaseUrl: ''
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
            nodeVersion: '20',
            httpsOptions: {
                region: 'europe-west3',
                maxInstances: 3
            }
        }
    }
})
