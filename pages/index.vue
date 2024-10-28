<template>
    <div class="flex justify-center items-center h-full">
        <CommonCard class="w-96 h-[400px] mt-20">
            <AudioDropzone v-if="isConnected" :is-empty="!!originalFileUrl" @drop.prevent="fileSelected" class="p-3">
                <div class="h-full">
                    <div v-if="!originalFile" class="pt-16 flex flex-col justify-center items-center gap-4">
                        <CommonStepperText
                            icon="ic:baseline-audio-file"
                            header="Step 1"
                            subheader="Upload the sound you want to turn Spookier!"
                        />
                        <input type="file" ref="fileInput" accept="audio/mpeg" @change="fileSelected" hidden />
                        <UButton @click="$refs.fileInput.click()">Upload sound</UButton>
                    </div>
                    <div v-else-if="originalFileUrl" class="h-full relative">
                        <Icon
                            name="ic:baseline-close"
                            size="2em"
                            class="my-1 absolute top-0 right-0 text-white z-10"
                            @click="resetFields"
                        />
                        <UModal v-model="isUploading" prevent-close fullscreen>
                            <div class="max-w-[400px] m-auto p-4">
                                <div v-if="!spookyFileUrl" class="text-white mb-4">Generating Spooky version...</div>
                                <div v-else class="text-white mb-4">Upload in progress...</div>
                                <UProgress animation="carousel" />
                            </div>
                        </UModal>
                        <AudioSubmit
                            v-if="!spookyFileUrl"
                            type="original"
                            :src="originalFileUrl"
                            :header="originalFile.name"
                            btn-text="SpookItUp!"
                            @submit="spookMeUp"
                        />
                        <AudioSubmit
                            v-else
                            :type="isDone ? 'final' : 'preview'"
                            :src="spookyFileUrl"
                            :header="spookyText"
                            :btn-text="spookyBtn"
                            @submit="toggleConsentModal"
                        />
                    </div>
                </div>
            </AudioDropzone>
            <div v-else class="flex flex-col justify-center items-center gap-4">
                <CommonStepperText icon="ic:baseline-login" subheader="Connect your wallet to start" />
                <w3m-button />
            </div>
        </CommonCard>
        <UModal v-model="isConsentOpen" fullscreen>
            <AudioConsent @submit="spookMeUp(true)" />
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue'

const { isConnected } = useAccount()
const config = useRuntimeConfig()

const isConsentOpen = ref(false)
const fileInput = ref<File | null>(null)

const isUploading = ref(false)
const originalFile = ref<File | null>(null)
const originalFileUrl = computed(() => {
    return originalFile.value ? URL.createObjectURL(originalFile.value) : null
})

const spookyFile = ref<File | null>(null)
const spookyFileUrl = computed(() => {
    return spookyFile.value ? URL.createObjectURL(spookyFile.value) : null
})
const fileSelected = (evt: Event | DragEvent) => {
    let selectedFile
    if (evt instanceof DragEvent && evt.dataTransfer) {
        if (evt.dataTransfer.files.length > 1) {
            alert('Please only upload one file at a time')
            return
        }
        selectedFile = evt.dataTransfer.files[0]
    } else {
        selectedFile = (evt.target as HTMLInputElement).files?.[0]
    }
    if (!selectedFile || !selectedFile.type.match('audio.*')) return
    originalFile.value = selectedFile
}

const resetFields = () => {
    originalFile.value = null
    spookyFile.value = null
    fileInput.value = null
}

const toggleConsentModal = () => {
    isConsentOpen.value = !isConsentOpen.value
}

const isDone = ref(false)

const spookyText = computed(() => {
    return isDone.value ? '👻 Congratulations! 👻' : '👇 Your Spooky version is Ready! 👇'
})

const spookyBtn = computed(() => {
    return isDone.value ? 'Go to Uploads' : 'Finalize & Upload'
})
const spookMeUp = async (isSpooky = false) => {
    if (isSpooky && isConsentOpen.value) {
        toggleConsentModal()
    }
    isUploading.value = true
    const formdata = new FormData()
    if (originalFile.value) {
        formdata.append('file', originalFile.value, originalFile.value.name)
        try {
            const res = await $fetch(isSpooky ? '/api/upload' : `${config.public.apiBaseUrl}/spookmeup`, {
                method: 'POST',
                body: formdata,
                onResponseError: ({ response }) => {
                    console.error('Error uploading the file:', response)
                },
                onResponse: ({ response }) => {
                    if (response.ok) {
                        if (isSpooky) {
                            isDone.value = true
                        } else {
                            spookyFile.value = response._data
                        }
                    }
                    isUploading.value = false
                }
            })
        } catch (error) {
            console.error('Error spooking up the file:', error)
        }
    }
}
</script>
