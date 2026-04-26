<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { useLinkStore } from '~/stores/link'

const linkStore = useLinkStore()
const loading = ref(true)

function getFavicon(url: string) {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`
  } catch {
    return ''
  }
}

onMounted(async () => {
  await linkStore.refreshLink()
  loading.value = false
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">連結</h1>
    <div class="w-12 h-1 bg-blue-600 rounded mb-8"></div>

    <!-- 讀取中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- 無資料 -->
    <div v-else-if="linkStore.visibleList.length === 0"
         class="text-center py-20 text-gray-400 dark:text-gray-500">
      目前沒有連結
    </div>

    <!-- 連結卡片 -->
    <div v-else class="flex flex-col gap-3">
      <a
          v-for="l in linkStore.visibleList"
          :key="l.id"
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500
               hover:shadow-md transition-all duration-200">
        <!-- favicon + emoji fallback -->
        <div class="w-8 h-8 flex-none flex items-center justify-center">
          <img
              :src="getFavicon(l.url)"
              :alt="l.name"
              class="w-7 h-7 rounded"
              @error="(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling!.style.display='flex' }"
          />
          <span class="text-2xl hidden items-center justify-center">{{ l.icon }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {{ l.name }}
          </p>
          <p v-if="l.desc" class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{{ l.desc }}</p>
        </div>
        <svg class="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 flex-none transition-colors"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</template>