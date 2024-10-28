<template>
    <div class="flex justify-center items-center h-full mt-28">
        <div class="bg-vulcan-950/95 w-96 h-[400px] rounded-xl p-4 flex justify-center items-center">
            <div class="flex flex-col justify-center items-center gap-4">
                <CommonStepperText icon="ic:baseline-login" subheader="Connect your wallet to start" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue'
const { isConnected } = useAccount()

const dropzoneFile = ref<string | ArrayBuffer | null>(null)

const computedSrc = computed(() => {
    return typeof dropzoneFile.value === 'string' ? dropzoneFile.value : undefined
})

const fileSelected = (evt: Event | DragEvent) => {
    let file
    if (evt instanceof DragEvent) {
        if (!evt.dataTransfer) return
        if (evt.dataTransfer?.files && evt.dataTransfer.files.length > 1) {
            alert('Please only upload one file at a time')
            return
        }
        file = evt.dataTransfer.files[0]
        if (!file.type.match('audio.*')) {
            return
        }
    } else {
        file = (evt.target as HTMLInputElement).files?.[0]
        if (!file) return
        if (!file.type.match('audio.*')) {
            return
        }
    }
    const reader = new FileReader()
    reader.onload = e => {
        if (e.target) {
            dropzoneFile.value = e.target.result
        }
    }
    reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped></style>
