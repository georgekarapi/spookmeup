<template>
    <div class="max-w-[400px] m-auto p-4 bg-vulcan-950/95 flex flex-col gap-2">
        <div class="text-white">Filename:</div>
        <UInput
            v-model="fileName"
            color="white"
            variant="outline"
            placeholder="Type a spooky filename..."
            class="mb-4"
        />
        <UCheckbox v-model="termsConsent" label="I consent to the Terms & Condiditions" required />
        <UCheckbox v-model="ipfsConsent" label="The file will be PERMANENTLY stored, due to nature of IPFS" required />
        <UButton :disabled="isDisabled" trailing block @click="$emit('submit')">Yeap, Upload it!</UButton>
    </div>
</template>
<script lang="ts" setup>
const fileName = ref('')
const termsConsent = ref(false)
const ipfsConsent = ref(false)

const isDisabled = computed(() => {
    return !termsConsent.value || !ipfsConsent.value || !fileName.value
})
</script>
