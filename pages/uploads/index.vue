<template>
    <CommonCard>
        <div class="text-white text-2xl mb-4">Community Uploads</div>
        <div v-if="status === 'success'" v-for="upload in uploadList" class="w-full mb-4">
            <div class="mb-2">
                <a class="text-white" :href="upload.src" target="_blank"
                    >{{ upload.name
                    }}<span v-if="isCidEqual(upload.ipfsHash)" class="mx-2 text-orange-500 animate-pulse"
                        >(New)</span
                    ></a
                >
            </div>
            <audio :src="upload.src" controls class="w-full" preload="auto" />
        </div>
        <UProgress v-else animation="carousel" class="max-w-[500px] m-auto p-10" />
    </CommonCard>
</template>
<script setup lang="ts">
const route = useRoute()
const { data: uploadList, status } = useFetch(`/api/fetchUploads?cid=${route.query.cid}`)
const isCidEqual = (cid: string) => route.query.cid && route.query.cid === cid
</script>
