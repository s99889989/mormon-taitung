<template>
  <NavBar class="hidden md:block"/>
  <UpDownButton/>
  <NuxtPage />
  <BottomBar class="md:hidden"/>
</template>

<script setup lang="ts">
import { useDarkModeStore } from '~/stores/dark_mode'
import UpDownButton from "~/components/UpDownButton.vue"

const dark_mode = useDarkModeStore()

onMounted(() => {
  dark_mode.init()
})
</script>
