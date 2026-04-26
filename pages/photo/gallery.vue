<script setup lang="ts">
definePageMeta({ layout: 'photo' })

const route = useRoute()

const pathArr = computed(() => {
  try { return JSON.parse(decodeURIComponent(route.query.path as string)) }
  catch { return [] }
})
const title = computed(() => decodeURIComponent(route.query.title as string || ''))
const type = computed(() => route.query.type as string || 'photo')

const BASE_URL = 'https://madustrialtd.asuscomm.com:8080'
const THUMBNAIL_WIDTH = 400

// ── 照片 ─────────────────────────────────────────────────────────
const photos = reactive<{ data: any[] }>({ data: [] })
const currentPage = ref(1)
const totalPages = ref(1)

const thumbUrl = (p: string) =>
    `${BASE_URL}/ysa/thumbnail?path=${encodeURIComponent(p)}&width=${THUMBNAIL_WIDTH}`
const fullUrl = (p: string) => `${BASE_URL}/${p}`

const fetchTotalPages = async () => {
  const res = await fetch(`${BASE_URL}/ysa/image_count_pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathArr.value, amount: 30 }),
  })
  totalPages.value = Number(await res.json())
}

const fetchImages = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/ysa/image_select_pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: pathArr.value, amount: 30, page }),
  })
  photos.data = await res.json()
  nextTick(() => observeImages())
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
  photos.data = []
  fetchImages(page)
  window.scrollTo(0, 0)
}

// ── 漸進式載入 ────────────────────────────────────────────────────
let observer: IntersectionObserver | null = null

const observeImages = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const img = entry.target as HTMLImageElement
      if (!img.dataset.full || img.dataset.loaded === 'true') return
      const hi = new Image()
      hi.src = img.dataset.full
      hi.onload = () => {
        img.src = img.dataset.full!
        img.classList.remove('img-blur')
        img.dataset.loaded = 'true'
      }
      observer?.unobserve(img)
    })
  }, { rootMargin: '200px' })
  document.querySelectorAll('.lazy-img').forEach(el => observer?.observe(el))
}

// ── 影片 ─────────────────────────────────────────────────────────
const videos = reactive<{ data: any[] }>({ data: [] })

const fetchVideos = async () => {
  const res = await fetch(`${BASE_URL}/ysa/video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pathArr.value),
  })
  videos.data = await res.json()
}

onMounted(() => {
  if (type.value === 'photo') {
    fetchTotalPages()
    setTimeout(() => fetchImages(1), 100)
  } else {
    fetchVideos()
  }
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="dark:bg-black bg-white min-h-screen px-4 py-6">

    <!-- 標題 + 返回 -->
    <div class="max-w-5xl mx-auto flex items-center gap-3 mb-4">
      <NuxtLink to="/photo/home"
                class="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </NuxtLink>
      <h1 class="text-xl font-bold dark:text-white text-gray-900">{{ title }}</h1>
    </div>

    <!-- ── 照片 ── -->
    <template v-if="type === 'photo'">
      <!-- 分頁（上） -->
      <div class="max-w-5xl mx-auto flex justify-center mb-4">
        <div class="flex items-center gap-1">
          <button @click="goToPage(currentPage - 1)"
                  class="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700
                         text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ‹
          </button>
          <button v-for="p in totalPages" :key="p" @click="goToPage(p)"
                  :class="p === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  class="px-3 py-1.5 rounded-lg text-sm border transition-colors">
            {{ p }}
          </button>
          <button @click="goToPage(currentPage + 1)"
                  class="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700
                         text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ›
          </button>
        </div>
      </div>

      <!-- 圖片格狀 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-5xl mx-auto">
        <div v-for="item in photos.data" :key="item.image" class="overflow-hidden rounded-xl">
          <div v-if="item.panoramic" class="w-full h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <p class="text-gray-500 text-sm">全景圖</p>
          </div>
          <img v-else
               class="lazy-img object-contain w-full img-blur transition-all duration-300"
               :src="thumbUrl(item.image)"
               :data-full="fullUrl(item.image)"
               data-loaded="false"
               alt="" />
        </div>
      </div>

      <!-- 分頁（下） -->
      <div class="max-w-5xl mx-auto flex justify-center mt-6">
        <div class="flex items-center gap-1">
          <button @click="goToPage(currentPage - 1)"
                  class="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700
                         text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ‹
          </button>
          <button v-for="p in totalPages" :key="p" @click="goToPage(p)"
                  :class="p === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
                  class="px-3 py-1.5 rounded-lg text-sm border transition-colors">
            {{ p }}
          </button>
          <button @click="goToPage(currentPage + 1)"
                  class="px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-700
                         text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            ›
          </button>
        </div>
      </div>
    </template>

    <!-- ── 影片 ── -->
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div v-for="item in videos.data" :key="item.urlPath" class="rounded-xl overflow-hidden">
          <iframe class="w-full aspect-video" :src="item.urlPath" allowfullscreen></iframe>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.img-blur { filter: blur(8px); transition: filter 0.3s; }
</style>