<template>
    <div class="text-center text-white">
        <Icon v-if="icon" :name="icon" size="2em" class="my-1" />
        <div>
            <div class="font-medium text-xl">{{ header }}</div>
            <div>{{ subheader }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps({
    header: {
        type: String,
        required: true
    },
    subheader: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    }
})
</script>
