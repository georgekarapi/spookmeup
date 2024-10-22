<template>
    <div>
        <audio ref="audio" :src="src" @ended="onAudioEnded" />
        <div class="flex flex-col">
            <button @click="togglePlay" class="text-white mr-4">
                <Icon :name="isPlaying ? 'ic:baseline-pause' : 'ic:baseline-play-arrow'" size="6em" />
            </button>
            <div class="flex items-center mx-4">
                <URange
                    v-model="currentTime"
                    :min="0"
                    :max="duration"
                    @input="seek"
                    class="w-full h-2 rounded-lg cursor-pointer mr-2 accent-orange-400"
                />
                <div class="text-white whitespace-nowrap">{{ seekTime }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    src: {
        type: String,
        required: true
    }
})

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const togglePlay = () => {
    if (isPlaying.value) {
        audio.value?.pause()
    } else {
        audio.value?.play()
    }
    isPlaying.value = !isPlaying.value
}

const updateCurrentTime = () => {
    currentTime.value = audio.value?.currentTime ?? 0
}

const updateDuration = () => {
    duration.value = audio.value?.duration ?? 0
}

const seek = (event: Event) => {
    const target = event.target as HTMLInputElement
    audio.value!.currentTime = parseFloat(target.value)
}

const seekTime = computed(() => {
    return `${formatTime(currentTime.value)} / ${formatTime(duration.value)}`
})

const onAudioEnded = () => {
    currentTime.value = 0
    audio.value!.currentTime = 0
    isPlaying.value = false
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    return `${minutes}:${formattedSeconds}`
}

onMounted(() => {
    audio.value?.addEventListener('timeupdate', updateCurrentTime)
    audio.value?.addEventListener('loadedmetadata', updateDuration)
})

onBeforeUnmount(() => {
    audio.value?.removeEventListener('timeupdate', updateCurrentTime)
    audio.value?.removeEventListener('loadedmetadata', updateDuration)
})
</script>
