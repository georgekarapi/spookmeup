import { defineEventHandler } from 'h3'
import { createHeliaHTTP } from '@helia/http'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'

export default defineEventHandler(async event => {
    try {
        const { cid } = getQuery(event)
        const client = event.context.storachaClient
        const uploads = await client.capability.upload.list({ cursor: '', size: 50 })

        const helia = await createHeliaHTTP()
        const fs = unixfs(helia)
        const results = await Promise.all(
            uploads.results.map(async (upload: unknown) => {
                const ipfsHash = upload.root.toString()
                const entries = []
                for await (const entry of fs.ls(CID.parse(ipfsHash))) {
                    entries.push({ name: entry.name, src: `https://${ipfsHash}.ipfs.w3s.link/${entry.name}` })
                }
                return entries
            })
        )
        return results.flat()
    } catch (e) {
        console.error(e)
    }
})
