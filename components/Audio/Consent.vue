<template>
    <div class="max-w-[400px] m-auto p-4 bg-vulcan-950/95 flex flex-col gap-2">
        <UCheckbox v-model="termsConsent" label="I consent to the Terms & Condiditions" required />
        <UCheckbox v-model="ipfsConsent" label="The file will be PERMANENTLY stored, due to nature of IPFS" required />
        <UButton :disabled="isDisabled" trailing block @click="$emit('submit')">Yeap, Upload it!</UButton>
    </div>
</template>
<script lang="ts" setup>
const termsConsent = ref(false)
const ipfsConsent = ref(false)

const isDisabled = computed(() => {
    return !termsConsent.value || !ipfsConsent.value
})
</script>
