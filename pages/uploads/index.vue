<template>
    <CommonCard>
        <div class="text-white text-2xl mb-4">Community Uploads</div>
        <div v-for="upload in uploadList" class="w-full mb-4">
            <div class="mb-2">
                <a class="text-white" :href="upload.src" target="_blank">{{ upload.name.split('.mp3')[0] }}</a>
            </div>
            <audio :src="upload.src" controls class="w-full" preload="auto" />
        </div>
    </CommonCard>
</template>
<script setup lang="ts">
const route = useRoute()
const { data: uploadList } = useFetch(`/api/fetchUploads?cid=${route.query.cid}`)
</script>
