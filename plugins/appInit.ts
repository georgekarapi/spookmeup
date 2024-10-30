import { initializeApp } from 'firebase/app'

import { createAppKit } from '@reown/appkit/vue'
import { WagmiProvider } from 'wagmi'
import { mainnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'

const initFirebase = () => {
    const firebaseConfig = {
        apiKey: 'AIzaSyCV9V8C5p1TMQsgi3eJKqnIl9ni1zlCdE8',
        authDomain: 'spookmeup.firebaseapp.com',
        projectId: 'spookmeup',
        storageBucket: 'spookmeup.appspot.com',
        messagingSenderId: '90646247171',
        appId: '1:90646247171:web:f8651af69744d793a95b36'
    }
    const app = initializeApp(firebaseConfig)
}
const initReownAppKit = () => {
    const projectId = 'aa012f81284753d0663d1713ebb279e6'

    const metadata = {
        name: 'SpookMeUp',
        description: 'AppKit Example',
        url: 'https://reown.com/appkit',
        icons: ['https://assets.reown.com/reown-profile-pic.png']
    }

    const networks: [AppKitNetwork] = [mainnet]

    const wagmiAdapter = new WagmiAdapter({
        ssr: false,
        projectId,
        networks
    })

    createAppKit({
        adapters: [wagmiAdapter],
        networks,
        metadata,
        projectId,
        features: {
            email: false,
            analytics: true,
            socials: []
        },
        themeVariables: {
            '--w3m-accent': '#dc4f1a'
        }
    })

    return wagmiAdapter.wagmiConfig
}

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('app:created', () => {
        initFirebase()
        const wagmiConfig = initReownAppKit()
        const queryClient = new QueryClient()
        nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig })
        nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
    })
})
