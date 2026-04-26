<script setup lang="js">
import { apiFetch } from '~/utils/api'

definePageMeta({ layout: 'blank' })

const route = useRoute()
const slug  = route.params.slug

const htmlContent = ref('')
const error       = ref(false)

onMounted(async () => {
  try {
    const res = await apiFetch(`mormon/html-page/content/${slug}`)
    if (!res.ok) { error.value = true; return }
    htmlContent.value = await res.text()
  } catch {
    error.value = true
  }
})
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