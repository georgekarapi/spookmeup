import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'
import { defineEventHandler, readMultipartFormData } from 'h3'

export default defineEventHandler(async event => {
    const config = useRuntimeConfig()
    const principal = Signer.parse(config.storachaKey)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    const proof = await Proof.parse(config.storachaProof)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) throw new Error('No file uploaded')

    const blob = new Blob([files[0].data], { type: files[0].type })
    const fileToUpload = new File([blob], files[0].name || 'spooky.mp3')
    const fileCid = await client.uploadFile(blob)

    return {
        cid: fileCid,
        message: 'Upload successful!'
    }
})
