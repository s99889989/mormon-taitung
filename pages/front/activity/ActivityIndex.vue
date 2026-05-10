<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { useActiveStore } from '~/stores/active'

const activeStore = useActiveStore()
const loading = ref(true)
const selectedTag = ref('')

function stripHtml(html: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const allTags = computed(() => {
  const tagSet = new Set<string>()
  activeStore.normalList.forEach(a => {
    if (Array.isArray(a.tags)) {
      a.tags.forEach(t => tagSet.add(t))
    }
  })
  return Array.from(tagSet)
})

const filteredList = computed(() => {
  const list = activeStore.normalList
  if (!selectedTag.value) return list
  return list.filter(a => Array.isArray(a.tags) && a.tags.includes(selectedTag.value))
})

onMounted(async () => {
  await activeStore.refreshActive()
  loading.value = false
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">

    <!-- 標題 + 標籤篩選 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">活動</h1>
      <div class="w-12 h-1 bg-blue-600 rounded mb-5"></div>

      <!-- 標籤篩選列 -->
      <div v-if="allTags.length" class="flex flex-wrap gap-2">
        <button
            @click="selectedTag = ''"
            :class="selectedTag === ''
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
          全部
        </button>
        <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectedTag = selectedTag === tag ? '' : tag"
            :class="selectedTag === tag
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 讀取中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- 無資料 -->
    <div v-else-if="filteredList.length === 0"
         class="text-center py-20 text-gray-400 dark:text-gray-500">
      {{ selectedTag ? `沒有「${selectedTag}」分類的活動` : '目前沒有活動' }}
    </div>

    <!-- 卡片格狀 -->
    <div v-else class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
      <NuxtLink
          v-for="active in filteredList"
          :key="`${active.date}-${active.time}`"
          :to="`/front/activity/detail?date=${active.date}&time=${active.time}`"
          class="group bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700
               hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">

        <!-- 封面圖 -->
        <div class="w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden flex-none">
          <img v-if="active.images && active.images.length > 0"
               :src="active.images[0]" :alt="active.name"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎉</div>
        </div>

        <!-- 內容 -->
        <div class="p-4 flex flex-col flex-1">
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">{{ active.date }}</p>
          <p class="font-bold text-base text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ active.name }}
          </p>
          <p v-if="active.info" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
            {{ stripHtml(active.info) }}
          </p>

          <!-- 標籤 -->
          <div v-if="active.tags && active.tags.length" class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="tag in active.tags" :key="tag"
                  class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

  </div>
</template>