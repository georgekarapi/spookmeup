<template>
    <div class="h-screen">
        <CommonHeader />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <CommonFooter />
        <CommonBg />
    </div>
</template>
<script setup lang="ts">
useSeoMeta({
    title: 'SpookMeUp',
    description: 'Turn sounds spookier!'
})
</script>
