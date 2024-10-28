import { base } from 'viem/chains'

export default defineAppConfig({
    ui: {
        primary: 'orange',
        button: {
            font: 'font-medium',
            rounded: 'rounded-full',
            size: {
                '2xs': 'text-base',
                xs: 'text-base',
                sm: 'text-base',
                md: 'text-base',
                lg: 'text-base',
                xl: 'text-base'
            },
            padding: {
                '2xs': 'px-3 py-[5px]',
                xs: 'px-3 py-[5px]',
                sm: 'px-4 py-[9px]',
                md: 'px-4 py-[9px]',
                lg: 'px-4 py-[9px]',
                xl: 'px-4 py-[9px]'
            }
        }
    }
})
