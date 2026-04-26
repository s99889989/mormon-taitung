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

const normalList = computed(() => activeStore.normalList)
const currentIdx = computed(() =>
    normalList.value.findIndex(a => a.date === route.query.date && a.time === route.query.time)
)
const prevActive = computed(() => currentIdx.value > 0 ? normalList.value[currentIdx.value - 1] : null)
const nextActive = computed(() => currentIdx.value < normalList.value.length - 1 ? normalList.value[currentIdx.value + 1] : null)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8">

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

    <div v-else-if="!active" class="text-center py-20 text-gray-400">找不到此活動</div>

    <div v-else>

      <!-- 桌機左右兩欄 / 手機上下 -->
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- 左欄：封面圖 -->
        <div v-if="active.images && active.images.length > 0"
             class="lg:w-80 lg:flex-none">
          <div class="lg:sticky lg:top-24">
            <img :src="active.images[0]" :alt="active.name"
                 class="w-full rounded-2xl shadow-lg object-cover" />
          </div>
        </div>

        <!-- 右欄：內容 -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-400 dark:text-gray-500 mb-2">{{ active.date }}</p>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
            {{ active.name }}
          </h1>
          <div v-if="active.tags && active.tags.length" class="flex flex-wrap gap-1.5 mb-4">
            <span v-for="tag in active.tags" :key="tag"
                  class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {{ tag }}
            </span>
          </div>

          <div class="w-full h-px bg-gray-200 dark:bg-gray-700 mb-5"></div>

          <!-- 內文 -->
          <div v-if="active.info"
               class="tiptap-content text-gray-700 dark:text-gray-300 text-base lg:text-lg leading-relaxed"
               v-html="active.info">
          </div>

          <!-- 附件 -->
          <div v-if="active.attachments && active.attachments.length"
               class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">附件</p>
            <div class="flex flex-col gap-2">
              <a v-for="att in active.attachments" :key="att.url"
                 :href="att.url" target="_blank"
                 class="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                📎 {{ att.name }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 上一則 / 下一則 -->
      <div class="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
        <NuxtLink v-if="prevActive"
                  :to="`/front/activity/detail?date=${prevActive.date}&time=${prevActive.time}`"
                  class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          上一則
        </NuxtLink>
        <span v-else></span>

        <NuxtLink to="/front/activity/ActivityIndex"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors">
          回活動列表
        </NuxtLink>

        <NuxtLink v-if="nextActive"
                  :to="`/front/activity/detail?date=${nextActive.date}&time=${nextActive.time}`"
                  class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          下一則
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
        <span v-else></span>
      </div>
    </div>
  </div>
</template>

<style>
.tiptap-content {
  word-break: break-word;
  overflow-wrap: break-word;
}
.tiptap-content h2 { font-size: 1.3rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.tiptap-content h3 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.35rem; }
.tiptap-content p  { margin: 0.5rem 0; }
.tiptap-content ul { list-style: disc;    padding-left: 1.5rem; margin: 0.5rem 0; }
.tiptap-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.tiptap-content a  { color: #3b82f6; text-decoration: underline; word-break: break-all; }
.dark .tiptap-content a  { color: #60a5fa; }
.tiptap-content strong { font-weight: 700; }
.tiptap-content em     { font-style: italic; }
.tiptap-content u      { text-decoration: underline; }
</style>