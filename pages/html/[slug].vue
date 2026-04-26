<script setup lang="js">
definePageMeta({ layout: 'blank' })

const route  = useRoute()
const config = useRuntimeConfig()
const slug   = route.params.slug

const { data: htmlContent, error } = await useFetch(
    `${config.public.apiBase}/mormon/html-page/content/${slug}`,
    {
      responseType: 'text',
      // 404 預設會被 useFetch 當成 error，不需要額外處理
    }
)
</script>

<template>
  <div v-if="error || !htmlContent"
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