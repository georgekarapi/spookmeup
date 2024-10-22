<template>
    <div class="flex justify-center items-center h-full mt-28">
        <div class="bg-vulcan-950/95 w-96 h-[400px] rounded-xl p-4">
            <AudioDropzone :is-empty="!!computedSrc" @drop.prevent="fileDropped">
                <div class="mt-16">
                    <div v-if="!dropzoneFile">
                        <CommonStepperText
                            icon="ic:baseline-audio-file"
                            header="Step 1"
                            subheader="Upload the sound you want to turn Spookier!"
                        />
                    </div>
                    <div v-else-if="computedSrc">
                        <AudioPlayer :src="computedSrc" />
                        <UButton class="px-2 py-3" icon="i-mdi-arrow-right" trailing block>Spook IT Up! (0/3)</UButton>
                    </div>
                </div>
            </AudioDropzone>
        </div>
    </div>
</template>

<script setup lang="ts">
const dropzoneFile = ref<string | ArrayBuffer | null>(null)

const computedSrc = computed(() => {
    return typeof dropzoneFile.value === 'string' ? dropzoneFile.value : undefined
})
const fileDropped = (evt: DragEvent) => {
    if (!evt.dataTransfer) return
    if (evt.dataTransfer?.files && evt.dataTransfer.files.length > 1) {
        alert('Please only upload one file at a time')
        return
    }
    const file = evt.dataTransfer.files[0]
    if (!file.type.match('audio.*')) {
        return
    }

    const reader = new FileReader()
    reader.onload = e => {
        if (e.target) {
            console.log(e.target.result)
            dropzoneFile.value = e.target.result
        }
    }
    reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped></style>
