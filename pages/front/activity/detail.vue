<script setup lang="ts">
definePageMeta({ layout: 'default' })

import { useActiveStore } from '~/stores/active'

const activeStore = useActiveStore()
const route = useRoute()

const loading = ref(true)

onMounted(async () => {
  await activeStore.refreshActive()
  loading.value = false
})

const active = computed(() =>
    [...activeStore.fixedList, ...activeStore.normalList].find(
        a => a.date === route.query.date && a.time === route.query.time
    )
)

// 上一則 / 下一則（只在 normalList 中導航）
const normalList = computed(() => activeStore.normalList)
const currentIdx = computed(() =>
    normalList.value.findIndex(a => a.date === route.query.date && a.time === route.query.time)
)
const prevActive = computed(() => currentIdx.value > 0 ? normalList.value[currentIdx.value - 1] : null)
const nextActive = computed(() => currentIdx.value < normalList.value.length - 1 ? normalList.value[currentIdx.value + 1] : null)

const formatContent = (text: string) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">

    <!-- 麵包屑 -->
    <div class="text-sm text-gray-400 dark:text-gray-500 mb-6">
      <NuxtLink to="/" class="hover:underline">首頁</NuxtLink>
      <span class="mx-1">›</span>
      <NuxtLink to="/front/activity/ActivityIndex" class="hover:underline">活動</NuxtLink>
    </div>

    <!-- 讀取中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!active" class="text-center py-20 text-gray-400">
      找不到此活動
    </div>

    <div v-else>
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-5 sm:px-10 py-8">
        <!-- 日期 -->
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-2">
          {{ active.date }} {{ active.time }}
        </p>
        <!-- 標題 -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ active.name }}</h1>
        <!-- 地點 -->
        <p v-if="active.location" class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          📍 {{ active.location }}
        </p>
        <!-- 分隔線 -->
        <div class="w-full h-px bg-gray-200 dark:bg-gray-700 mb-6"></div>

        <!-- 封面圖 -->
        <div v-if="active.images && active.images.length > 0"
             class="w-full sm:w-2/3 mx-auto rounded-xl overflow-hidden mb-6">
          <img :src="active.images[0]" :alt="active.name" class="w-full object-cover" />
        </div>

        <!-- 內文 -->
        <div v-if="active.info"
             class="text-gray-700 dark:text-gray-300 text-base leading-relaxed"
             v-html="formatContent(active.info)">
        </div>

        <!-- 其他照片 -->
        <div v-if="active.images && active.images.length > 1" class="mt-8">
          <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">活動照片</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="(img, idx) in active.images.slice(1)" :key="idx"
                 class="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img :src="img" :alt="`照片 ${idx + 2}`" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <!-- 上一則 / 下一則 -->
      <div class="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink v-if="prevActive"
                  :to="`/front/activity/detail?date=${prevActive.date}&time=${prevActive.time}`"
                  class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ← 上一則
        </NuxtLink>
        <span v-else class="opacity-40">← 上一則</span>

        <NuxtLink to="/front/activity/ActivityIndex"
                  class="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          回活動列表
        </NuxtLink>

        <NuxtLink v-if="nextActive"
                  :to="`/front/activity/detail?date=${nextActive.date}&time=${nextActive.time}`"
                  class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          下一則 →
        </NuxtLink>
        <span v-else class="opacity-40">下一則 →</span>
      </div>
    </div>
  </div>
</template>