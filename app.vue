<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '~/stores/dark_mode'

const dark_mode = useDarkModeStore()

onMounted(() => {
  dark_mode.init()
})
</script>
