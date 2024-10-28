<template>
    <div class="flex flex-col justify-between items-center h-full">
        <div class="w-full">
            <div class="text-white pb-8 text-center pt-2 truncate">{{ header }}</div>
            <AudioPlayer :src="src" />
        </div>
        <UButton icon="i-mdi-arrow-right" trailing block @click="$emit('submit')">{{ btnText }}</UButton>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    header: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    btnText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'original'
    }
})

const isPreview = computed(() => {
    return props.type === 'preview'
})
</script>
