<template>
    <div class="text-center text-white">
        <Icon v-if="icon" :name="icon" size="2em" class="my-1" />
        <div>
            <div v-if="header" class="font-medium text-xl">{{ header }}</div>
            <div v-if="subheader">{{ subheader }}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
defineProps({
    header: {
        type: String,
        default: ''
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
