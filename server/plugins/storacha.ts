import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'

export default defineNitroPlugin(async nitroApp => {
    const config = useRuntimeConfig()
    const principal = Signer.parse(config.storachaKey)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    const proof = await Proof.parse(config.storachaProof)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())
    nitroApp.hooks.hook('request', event => {
        event.context.storachaClient = client
    })
})
