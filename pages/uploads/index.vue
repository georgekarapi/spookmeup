<template>
    <CommonCard>
        <div v-for="upload in uploadList" class="w-full mb-4">
            <div class="text-white mb-2">{{ upload.name.split('.mp3')[0] }}</div>
            <audio :src="upload.src" controls class="w-full" />
        </div>
    </CommonCard>
</template>
<script setup lang="ts">
import { createHeliaHTTP } from '@helia/http'
import { unixfs } from '@helia/unixfs'
import { CID } from 'multiformats/cid'

const config = useRuntimeConfig()

const uploadList = ref<any[]>([])

const fetchUploads = async () => {
    const ipfsHash = config.public.ipfsHash
    const helia = await createHeliaHTTP()
    const fs = unixfs(helia)
    const uploads = []

    for await (const entry of fs.ls(CID.parse(ipfsHash))) {
        console.log(entry)
        uploads.push({ name: entry.name, src: `https://${ipfsHash}.ipfs.w3s.link/${entry.name}` })
    }

    uploadList.value = uploads
}

fetchUploads()
</script>
