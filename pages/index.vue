<template>
    <div class="flex justify-center items-center h-full">
        <CommonCard class="w-96 h-[400px] mt-20 flex justify-center items-center">
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
                            @submit="isDone ? goToUpload() : toggleConsentModal()"
                        />
                    </div>
                </div>
            </AudioDropzone>
            <div v-else class="flex flex-col justify-center items-center gap-4">
                <CommonStepperText icon="ic:baseline-login" subheader="Connect your wallet to start" />
                <w3m-connect-button />
            </div>
        </CommonCard>
        <UModal v-model="isConsentOpen" fullscreen>
            <AudioConsent @submit="fileName => spookMeUp(true, fileName)" />
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue'

const { isConnected } = useAccount()
const config = useRuntimeConfig()

const isConsentOpen = ref(false)
const fileInput = ref<File | null>(null)
const uploadedCid = ref<string | null>(null)

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
    isDone.value = false
    uploadedCid.value = null
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

const goToUpload = () => {
    navigateTo({ path: '/uploads', query: { cid: uploadedCid.value } })
}
const spookMeUp = async (isSpooky = false, fileName?: string) => {
    if (isSpooky && isConsentOpen.value) {
        toggleConsentModal()
    }
    const fileToUpload = isSpooky ? spookyFile : originalFile
    if (fileToUpload.value) {
        isUploading.value = true
        const formdata = new FormData()
        const fileToUpload = isSpooky ? spookyFile : originalFile
        const file = new File([fileToUpload.value!], fileName || 'no-name-spooky', { type: fileToUpload.value!.type })
        formdata.append('file', file)
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
                            uploadedCid.value = response._data
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
