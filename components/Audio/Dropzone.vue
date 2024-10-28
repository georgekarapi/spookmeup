<template>
    <div
        class="opacity-85 rounded-xl h-full w-full py-4"
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @drop.prevent="toggleActive"
        @dragover.prevent
        :class="{ 'bg-orange-400': isActive, 'border-2 border-dashed border-orange-400': !isEmpty }"
    >
        <slot />
    </div>
</template>
<script setup lang="ts">
defineProps({
    isEmpty: {
        type: Boolean,
        default: false
    }
})
const isActive = ref(false)
const toggleActive = () => {
    isActive.value = !isActive.value
}
</script>
