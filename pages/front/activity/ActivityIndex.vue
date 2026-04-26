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

// 依選擇的標籤過濾一般活動
const filteredNormalList = computed(() => {
  if (!selectedTag.value) return activeStore.normalList
  return activeStore.normalList.filter(a =>
      Array.isArray(a.tags) && a.tags.includes(selectedTag.value)
  )
})

// 目前所有已使用的標籤
const usedTags = computed(() => {
  const set = new Set<string>()
  activeStore.normalList.forEach(a => (a.tags || []).forEach((t: string) => set.add(t)))
  return [...set]
})

onMounted(async () => {
  await activeStore.refreshActive()
  loading.value = false
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">活動</h1>
    <div class="w-12 h-1 bg-blue-600 rounded mb-8"></div>

    <!-- 讀取中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else>
      <!-- 固定活動 -->
      <section v-if="activeStore.fixedList.length > 0" class="mb-10">
        <h2 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
          <span class="w-1 h-5 bg-green-500 rounded-full inline-block"></span>
          固定活動
        </h2>

        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-5 py-2">
          <div v-for="(active, idx) in activeStore.fixedList" :key="active.name">
            <div class="flex gap-4 py-5">
              <!-- 封面圖 -->
              <div class="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img v-if="active.images && active.images.length > 0"
                     :src="active.images[0]" :alt="active.name"
                     class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-3xl">🎉</div>
              </div>
              <!-- 文字 -->
              <div class="flex-1 min-w-0 flex flex-col">
                <p class="text-sm text-gray-400 dark:text-gray-500 mb-1">每{{ active.week }} {{ active.time }}</p>
                <p class="font-bold text-lg text-gray-900 dark:text-white leading-snug mb-1">{{ active.name }}</p>
                <div class="w-full h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <p v-if="active.location" class="text-sm text-gray-500 dark:text-gray-400 mb-1">📍 {{ active.location }}</p>
                <p v-if="active.info" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ stripHtml(active.info) }}
                </p>
                <!-- 標籤 -->
                <div v-if="active.tags && active.tags.length" class="flex flex-wrap gap-1.5 mt-2">
                  <span v-for="tag in active.tags" :key="tag"
                        class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {{ tag }}
                  </span>
                </div>
                <div class="mt-auto pt-2 text-right">
                  <NuxtLink :to="`/front/activity/detail?date=${active.date}&time=${active.time}`"
                            class="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    更 多 →
                  </NuxtLink>
                </div>
              </div>
            </div>
            <!-- 虛線分隔（最後一筆不顯示） -->
            <div v-if="idx < activeStore.fixedList.length - 1"
                 class="border-b border-dashed border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>
      </section>

      <!-- 一般活動 -->
      <section>
        <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 class="text-lg font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span class="w-1 h-5 bg-blue-500 rounded-full inline-block"></span>
            活動
          </h2>

          <!-- 標籤篩選列 -->
          <div v-if="activeStore.frontCategoryTags.length" class="flex flex-wrap gap-1.5">
            <button
                @click="selectedTag = ''"
                :class="selectedTag === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                class="px-3 py-1 rounded-full text-xs font-medium transition-colors">
              全部
            </button>
            <button
                v-for="tag in activeStore.frontCategoryTags"
                :key="tag"
                @click="selectedTag = selectedTag === tag ? '' : tag"
                :class="selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
                class="px-3 py-1 rounded-full text-xs font-medium transition-colors">
              {{ tag }}
            </button>
          </div>
        </div>

        <div v-if="filteredNormalList.length === 0"
             class="text-center py-16 text-gray-400 dark:text-gray-500">
          {{ selectedTag ? `沒有「${selectedTag}」分類的活動` : '目前沒有活動記錄' }}
        </div>

        <div v-else class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-5 py-2">
          <div v-for="(active, idx) in filteredNormalList" :key="`${active.date}-${active.time}`">
            <div class="flex gap-4 py-5">
              <!-- 封面圖 -->
              <div class="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img v-if="active.images && active.images.length > 0"
                     :src="active.images[0]" :alt="active.name"
                     class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-3xl">🎉</div>
              </div>
              <!-- 文字 -->
              <div class="flex-1 min-w-0 flex flex-col">
                <p class="text-sm text-gray-400 dark:text-gray-500 mb-1">{{ active.date }} {{ active.time }}</p>
                <p class="font-bold text-lg text-gray-900 dark:text-white leading-snug mb-1">{{ active.name }}</p>
                <div class="w-full h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                <p v-if="active.location" class="text-sm text-gray-500 dark:text-gray-400 mb-1">📍 {{ active.location }}</p>
                <p v-if="active.info" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ stripHtml(active.info) }}
                </p>
                <!-- 標籤 -->
                <div v-if="active.tags && active.tags.length" class="flex flex-wrap gap-1.5 mt-2">
                  <button
                      v-for="tag in active.tags"
                      :key="tag"
                      @click="selectedTag = selectedTag === tag ? '' : tag"
                      :class="selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'"
                      class="px-2 py-0.5 rounded-full text-xs font-medium transition-colors">
                    {{ tag }}
                  </button>
                </div>
                <div class="mt-auto pt-2 text-right">
                  <NuxtLink :to="`/front/activity/detail?date=${active.date}&time=${active.time}`"
                            class="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    更 多 →
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div v-if="idx < filteredNormalList.length - 1"
                 class="border-b border-dashed border-gray-200 dark:border-gray-700"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>