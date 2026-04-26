<template>
  <div :class="isDark ? 'dark bg-gray-900' : 'bg-white'" class="min-h-screen transition-colors">
    <FrontNavBar @toggle-dark="toggleDark" :is-dark="isDark" />
    <div class="pt-16 pb-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'front_dark_mode'

const isDark = ref(true)

const toggleDark = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, isDark.value ? '1' : '0')
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isDark.value = saved === '1'
  } else {
    // 沒有設定過就跟隨系統
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>