<script setup lang="ts">
definePageMeta({ layout: 'photo' })

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css' }
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js', defer: true }
  ]
})

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
  nextTick(() => {
    initPannellum()
    observeImages()
  })
}

const initPannellum = () => {
  nextTick(() => {
    photos.data.forEach((item: any) => {
      if (!item.panoramic) return
      const safeId = item.image.replace(/[^a-zA-Z0-9]/g, '_')
      const el = document.getElementById('pano-' + safeId)
      if (!el || el.dataset.init === 'true') return
      // @ts-ignore
      if (typeof window.pannellum === 'undefined') return

      // @ts-ignore
      const viewer = window.pannellum.viewer('pano-' + safeId, {
        type: 'equirectangular',
        panorama: fullUrl(item.image),
        autoLoad: true,
        autoRotate: -2,
        showZoomCtrl: true,
        mouseZoom: true,
        onLoad: () => {
          // 載入完成 → 隱藏模糊縮圖和 loading
          const blur = document.getElementById('pano-blur-' + safeId)
          const loading = document.getElementById('pano-loading-' + safeId)
          if (blur) blur.style.opacity = '0'
          if (loading) loading.style.opacity = '0'
        },
      })
      el.dataset.init = 'true'
    })
  })
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

const loadContent = () => {
  currentPage.value = 1
  photos.data = []
  videos.data = []
  if (type.value === 'photo') {
    fetchTotalPages()
    setTimeout(() => fetchImages(1), 100)
  } else {
    fetchVideos()
  }
}

onMounted(() => loadContent())

// query 改變時重新載入（NavBar 切換不同天）
watch(() => route.query, () => loadContent())

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
        <div v-for="item in photos.data" :key="item.image"
             :class="item.panoramic ? 'lg:col-span-2' : ''"
             class="overflow-hidden rounded-xl">
          <!-- 全景圖：先顯示模糊縮圖，載入完後初始化 Pannellum -->
          <div v-if="item.panoramic"
               :id="'pano-' + item.image.replace(/[^a-zA-Z0-9]/g, '_')"
               class="w-full relative"
               style="height: 400px;">
            <!-- 模糊縮圖背景（Pannellum 載入前顯示） -->
            <img
                :src="thumbUrl(item.image)"
                class="absolute inset-0 w-full h-full object-cover blur-sm scale-105 transition-opacity duration-500"
                :id="'pano-blur-' + item.image.replace(/[^a-zA-Z0-9]/g, '_')"
                alt=""
            />
            <!-- 載入中提示 -->
            <div class="absolute inset-0 flex items-center justify-center"
                 :id="'pano-loading-' + item.image.replace(/[^a-zA-Z0-9]/g, '_')">
              <div class="flex flex-col items-center gap-2 text-white drop-shadow">
                <div class="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs">360° 載入中…</span>
              </div>
            </div>
          </div>
          <!-- 一般照片：漸進式載入 -->
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
          <p v-if="item.name" class="text-xs text-center text-gray-500 dark:text-gray-400 py-1">{{ item.name }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.img-blur { filter: blur(8px); transition: filter 0.3s; }
</style>