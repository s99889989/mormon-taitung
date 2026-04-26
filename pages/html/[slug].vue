<script setup lang="js">
// 用 blank layout，直接全頁顯示 HTML 內容（用 srcdoc iframe 隔離樣式）
definePageMeta({ layout: 'blank' })

const route  = useRoute()
const config = useRuntimeConfig()
const slug   = route.params.slug

const { data, error, status } = await useFetch(
  `${config.public.apiBase}/mormon/html-page/content/${slug}`
)

const htmlContent = computed(() => data.value || '')
</script>

<template>
  <div v-if="status === 'pending'" class="flex items-center justify-center min-h-screen bg-white">
    <div class="flex items-center gap-3 text-stone-400">
      <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>載入中…</span>
    </div>
  </div>

  <div v-else-if="error || !htmlContent"
       class="flex flex-col items-center justify-center min-h-screen bg-white gap-3">
    <p class="text-4xl">😕</p>
    <p class="text-stone-500 text-lg">找不到此頁面</p>
    <a href="/" class="text-blue-500 text-sm hover:underline">回首頁</a>
  </div>

  <!-- 用 iframe srcdoc 讓 HTML 完整獨立渲染，不受 Nuxt 樣式影響 -->
  <iframe
    v-else
    :srcdoc="htmlContent"
    class="w-full border-0"
    style="height: 100vh; display: block;"
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    title="HTML 頁面"
  ></iframe>
</template>
