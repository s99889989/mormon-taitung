<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const BASE_URL = 'https://madustrialtd.asuscomm.com:8080'

// ── Tab ───────────────────────────────────────────────────────────
const activeTab = ref<'photo' | 'video'>('photo')

// ── Toast ─────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', error: false })
const showToast = (msg: string, error = false) => {
  toast.message = msg; toast.error = error; toast.show = true
  setTimeout(() => toast.show = false, 2500)
}

// ════════════════════════════════════════════════════════════════
// ── 照片 ────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const photoFolders = ref<any[]>([])
const photoFoldersLoading = ref(false)
const selectedPhotoPath = ref<string[]>([])
const selectedPhotoLabel = ref('')
const images = ref<{ image: string; panoramic: boolean }[]>([])
const imagesLoading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const mkdirModal = reactive({ show: false, year: '', event: '', day: '' })
const deleteImgTarget = ref('')
const showDeleteImg = ref(false)
const clearingCache = ref(false)

const thumbUrl = (p: string) => `${BASE_URL}/ysa/thumbnail?path=${encodeURIComponent(p)}&width=300`
const fullUrl  = (p: string) => `${BASE_URL}/${p}`

const loadPhotoFolders = async () => {
  photoFoldersLoading.value = true
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/folders`)
    photoFolders.value = await res.json()
  } catch { showToast('載入失敗', true) }
  finally { photoFoldersLoading.value = false }
}

const selectPhotoPath = async (path: string[], label: string) => {
  selectedPhotoPath.value = path
  selectedPhotoLabel.value = label
  imagesLoading.value = true
  images.value = []
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/list-images`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(path),
    })
    images.value = await res.json()
  } catch { showToast('載入圖片失敗', true) }
  finally { imagesLoading.value = false }
}

const handleUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  if (!selectedPhotoPath.value.length) { showToast('請先選擇資料夾', true); return }
  uploading.value = true
  const fd = new FormData()
  selectedPhotoPath.value.forEach(p => fd.append('path', p))
  Array.from(input.files).forEach(f => fd.append('files', f))
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/upload`, { method: 'POST', body: fd })
    showToast(await res.text())
    await selectPhotoPath(selectedPhotoPath.value, selectedPhotoLabel.value)
  } catch { showToast('上傳失敗', true) }
  finally { uploading.value = false; input.value = '' }
}

const doDeleteImg = async () => {
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/delete`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath: deleteImgTarget.value }),
    })
    showToast(await res.text())
    images.value = images.value.filter(i => i.image !== deleteImgTarget.value)
  } catch { showToast('刪除失敗', true) }
  finally { showDeleteImg.value = false }
}

const doMkdir = async () => {
  const { year, event, day } = mkdirModal
  if (!year || !event || !day) { showToast('請填寫完整', true); return }
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/mkdir`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: ['ysa', 'image', year, event, day] }),
    })
    showToast(await res.text())
    mkdirModal.show = false
    Object.assign(mkdirModal, { year: '', event: '', day: '' })
    await loadPhotoFolders()
  } catch { showToast('建立失敗', true) }
}

const doClearCache = async () => {
  clearingCache.value = true
  try {
    showToast(await (await fetch(`${BASE_URL}/ysa/manage/clear-cache`, { method: 'POST' })).text())
  } catch { showToast('失敗', true) }
  finally { clearingCache.value = false }
}

// ════════════════════════════════════════════════════════════════
// ── 影片 ────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const videoFolders = ref<any[]>([])
const videoFoldersLoading = ref(false)
const selectedVideoPath = ref<string[]>([])
const selectedVideoLabel = ref('')
const videoList = ref<{ key: string; name: string; url: string }[]>([])
const videoLoading = ref(false)
const videoSaving = ref(false)
const newVideoModal = reactive({ show: false, year: '', event: '', day: '' })
const showDeleteVideo = ref(false)
const deleteVideoIdx = ref(-1)

const loadVideoFolders = async () => {
  videoFoldersLoading.value = true
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/video-folders`)
    videoFolders.value = await res.json()
  } catch { showToast('載入失敗', true) }
  finally { videoFoldersLoading.value = false }
}

const selectVideoPath = async (path: string[], label: string) => {
  selectedVideoPath.value = path
  selectedVideoLabel.value = label
  videoLoading.value = true
  videoList.value = []
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/video-list`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(path),
    })
    videoList.value = await res.json()
  } catch { showToast('載入影片失敗', true) }
  finally { videoLoading.value = false }
}

const addVideoRow = () => {
  videoList.value.push({ key: String(Date.now()), name: '', url: '' })
}

const removeVideoRow = (idx: number) => {
  deleteVideoIdx.value = idx
  showDeleteVideo.value = true
}

const doDeleteVideoRow = () => {
  videoList.value.splice(deleteVideoIdx.value, 1)
  showDeleteVideo.value = false
}

const saveVideos = async () => {
  if (!selectedVideoPath.value.length) { showToast('請先選擇資料夾', true); return }
  videoSaving.value = true
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/video-save`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: selectedVideoPath.value, videos: videoList.value }),
    })
    showToast(await res.text())
  } catch { showToast('儲存失敗', true) }
  finally { videoSaving.value = false }
}

const doCreateVideoFolder = async () => {
  const { year, event, day } = newVideoModal
  if (!year || !event || !day) { showToast('請填寫完整', true); return }
  const path = ['ysa', 'video', year, event, day]
  // 建立空 yml（儲存空影片列表）
  try {
    const res = await fetch(`${BASE_URL}/ysa/manage/video-save`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, videos: [] }),
    })
    showToast(await res.text())
    newVideoModal.show = false
    Object.assign(newVideoModal, { year: '', event: '', day: '' })
    await loadVideoFolders()
  } catch { showToast('建立失敗', true) }
}

const videoFileInputRef = ref<HTMLInputElement | null>(null)
const videoUploading = ref(false)
const videoUploadProgress = ref(0)

const handleVideoUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  if (!selectedVideoPath.value.length) { showToast('請先選擇資料夾', true); return }

  const file = input.files[0]
  videoUploading.value = true
  videoUploadProgress.value = 0

  const fd = new FormData()
  selectedVideoPath.value.forEach(p => fd.append('path', p))
  fd.append('file', file)

  try {
    // 用 XMLHttpRequest 取得上傳進度
    const result = await new Promise<{ name: string; url: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          videoUploadProgress.value = Math.round(e.loaded / e.total * 100)
      }
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText)
        if (data.error) reject(new Error(data.error))
        else resolve(data)
      }
      xhr.onerror = () => reject(new Error('上傳失敗'))
      xhr.open('POST', `${BASE_URL}/ysa/manage/video-upload`)
      xhr.send(fd)
    })

    // 上傳完成後自動加入列表
    videoList.value.push({ key: String(Date.now()), name: result.name, url: result.url })
    showToast('上傳成功，請記得儲存')
  } catch (err: any) {
    showToast(err.message || '上傳失敗', true)
  } finally {
    videoUploading.value = false
    videoUploadProgress.value = 0
    input.value = ''
  }
}

// ── 初始化 ────────────────────────────────────────────────────────
onMounted(() => {
  loadPhotoFolders()
  loadVideoFolders()
})

watch(activeTab, (tab) => {
  if (tab === 'photo' && !photoFolders.value.length) loadPhotoFolders()
  if (tab === 'video' && !videoFolders.value.length) loadVideoFolders()
})

// YouTube embed URL 轉換
const toEmbedUrl = (url: string) => {
  if (!url) return ''
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}
</script>

<template>
  <div class="dark:bg-black bg-gray-50 min-h-screen container-top">
    <div class="max-w-6xl mx-auto px-4 py-5">

      <!-- 頁標題 -->
      <div class="flex items-center justify-between mb-5 flex-wrap gap-2">
        <p class="text-black dark:text-white text-2xl sm:text-4xl font-bold">媒體管理</p>
        <div class="flex gap-2">
          <button v-if="activeTab === 'photo'" @click="doClearCache" :disabled="clearingCache"
                  class="px-3 py-1.5 text-sm border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50">
            {{ clearingCache ? '清除中…' : '清除快取' }}
          </button>
        </div>
      </div>

      <!-- Tab 切換 -->
      <div class="flex gap-1 mb-5 bg-stone-100 dark:bg-zinc-800 rounded-xl p-1 w-fit">
        <button @click="activeTab = 'photo'"
                :class="activeTab === 'photo' ? 'bg-white dark:bg-zinc-700 shadow text-stone-800 dark:text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
          📷 照片
        </button>
        <button @click="activeTab = 'video'"
                :class="activeTab === 'video' ? 'bg-white dark:bg-zinc-700 shadow text-stone-800 dark:text-white' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
          🎬 影片
        </button>
      </div>

      <!-- ════════ 照片 Tab ════════ -->
      <div v-if="activeTab === 'photo'" class="flex gap-5 flex-col lg:flex-row">

        <!-- 左側：資料夾 -->
        <div class="lg:w-56 flex-none">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div class="px-4 py-3 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between">
              <p class="text-sm font-semibold text-stone-600 dark:text-stone-300">資料夾</p>
              <button @click="mkdirModal.show = true"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline">＋ 新增</button>
            </div>
            <div v-if="photoFoldersLoading" class="flex justify-center py-6">
              <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else class="overflow-y-auto max-h-[60vh]">
              <div v-for="y in photoFolders" :key="y.year">
                <div class="px-3 py-1.5 text-xs font-bold text-stone-400 bg-stone-50 dark:bg-zinc-800">{{ y.year }}</div>
                <div v-for="ev in y.events" :key="ev.name">
                  <!-- selfSelect：資料夾本身直接點（如 hualien） -->
                  <button v-if="ev.selfSelect"
                          @click="selectPhotoPath(['ysa','image',y.year,ev.name], `${y.year} ${ev.name}`)"
                          :class="selectedPhotoLabel === `${y.year} ${ev.name}`
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'"
                          class="w-full text-left px-3 py-1 text-xs font-semibold pl-5 transition-colors block">
                    {{ ev.name }}
                  </button>
                  <div v-else class="px-3 py-1 text-xs font-semibold text-stone-500 pl-5">{{ ev.name }}</div>
                  <button v-for="day in ev.days" :key="day"
                          @click="selectPhotoPath(['ysa','image',y.year,ev.name,day], `${y.year} ${ev.name} ${day}`)"
                          :class="selectedPhotoLabel === `${y.year} ${ev.name} ${day}`
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'"
                          class="w-full text-left pl-9 pr-3 py-1.5 text-xs transition-colors block truncate">
                    {{ day }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：圖片 -->
        <div class="flex-1 min-w-0">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div class="px-4 py-3 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-stone-600 dark:text-stone-300">
                {{ selectedPhotoLabel || '請選擇資料夾' }}
                <span v-if="images.length" class="ml-1 text-stone-400">({{ images.length }} 張，其中 {{ images.filter(i => i.panoramic).length }} 張 360°)</span>
              </p>
              <button v-if="selectedPhotoPath.length" @click="fileInputRef?.click()" :disabled="uploading"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap">
                <div v-if="uploading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                上傳
              </button>
              <input ref="fileInputRef" type="file" multiple accept="image/*" class="hidden" @change="handleUpload" />
            </div>
            <div v-if="!selectedPhotoPath.length" class="flex flex-col items-center justify-center py-16 text-stone-400 gap-2">
              <p class="text-sm">從左側選擇資料夾</p>
            </div>
            <div v-else-if="imagesLoading" class="flex justify-center py-12">
              <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="images.length === 0" class="text-center py-12 text-stone-400 text-sm">此資料夾沒有照片</div>
            <div v-else class="p-4 grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))">
              <div v-for="img in images" :key="img.image"
                   class="group relative rounded-xl overflow-hidden border border-stone-100 dark:border-stone-800 aspect-square bg-stone-50 dark:bg-zinc-800">
                <img :src="thumbUrl(img.image)" class="w-full h-full object-cover" :alt="img.image" />
                <!-- 360° 標記 -->
                <span v-if="img.panoramic"
                      class="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-md">
                  360°
                </span>
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <a :href="fullUrl(img.image)" target="_blank" class="px-2 py-1 text-xs bg-white/20 text-white rounded-lg hover:bg-white/30">查看原圖</a>
                  <button @click="deleteImgTarget = img.image; showDeleteImg = true"
                          class="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">刪除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ════════ 影片 Tab ════════ -->
      <div v-if="activeTab === 'video'" class="flex gap-5 flex-col lg:flex-row">

        <!-- 左側：資料夾 -->
        <div class="lg:w-56 flex-none">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div class="px-4 py-3 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between">
              <p class="text-sm font-semibold text-stone-600 dark:text-stone-300">資料夾</p>
              <button @click="newVideoModal.show = true"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline">＋ 新增</button>
            </div>
            <div v-if="videoFoldersLoading" class="flex justify-center py-6">
              <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else class="overflow-y-auto max-h-[60vh]">
              <div v-for="y in videoFolders" :key="y.year">
                <div class="px-3 py-1.5 text-xs font-bold text-stone-400 bg-stone-50 dark:bg-zinc-800">{{ y.year }}</div>
                <div v-for="ev in y.events" :key="ev.name">
                  <div class="px-3 py-1 text-xs font-semibold text-stone-500 pl-5">{{ ev.name }}</div>
                  <button v-for="day in ev.days" :key="day"
                          @click="selectVideoPath(['ysa','video',y.year,ev.name,day], `${y.year} ${ev.name} ${day}`)"
                          :class="selectedVideoLabel === `${y.year} ${ev.name} ${day}`
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'"
                          class="w-full text-left pl-9 pr-3 py-1.5 text-xs transition-colors block truncate">
                    {{ day }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：影片編輯 -->
        <div class="flex-1 min-w-0">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div class="px-4 py-3 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-stone-600 dark:text-stone-300">
                {{ selectedVideoLabel || '請選擇資料夾' }}
              </p>
              <div v-if="selectedVideoPath.length" class="flex gap-2">
                <button @click="videoFileInputRef?.click()" :disabled="videoUploading"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50 transition-colors whitespace-nowrap">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  上傳影片
                </button>
                <input ref="videoFileInputRef" type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />
                <button @click="addVideoRow"
                        class="px-3 py-1.5 text-sm border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap">
                  ＋ 新增連結
                </button>
                <button @click="saveVideos" :disabled="videoSaving"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap">
                  <div v-if="videoSaving" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  儲存
                </button>
              </div>
            </div>

            <div v-if="!selectedVideoPath.length" class="flex flex-col items-center justify-center py-16 text-stone-400 gap-2">
              <p class="text-sm">從左側選擇資料夾</p>
            </div>
            <div v-else-if="videoLoading" class="flex justify-center py-12">
              <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <!-- 上傳進度 -->
            <div v-if="videoUploading" class="px-4 pt-3">
              <div class="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div class="flex-1">
                  <p class="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">上傳中… {{ videoUploadProgress }}%</p>
                  <div class="w-full h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                    <div class="h-full bg-purple-600 rounded-full transition-all duration-200"
                         :style="{ width: videoUploadProgress + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="p-4 space-y-3">
              <div v-if="videoList.length === 0" class="text-center py-8 text-stone-400 text-sm">
                目前沒有影片，點「新增影片」開始新增
              </div>
              <div v-for="(video, idx) in videoList" :key="video.key"
                   class="flex gap-3 items-start p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-zinc-800">
                <!-- 序號 -->
                <span class="text-stone-400 text-sm font-medium mt-2 w-5 flex-none">{{ idx + 1 }}</span>
                <!-- 欄位 -->
                <div class="flex-1 space-y-2">
                  <input v-model="video.name" placeholder="影片名稱"
                         class="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
                  <input v-model="video.url" placeholder="YouTube 網址或 embed URL"
                         class="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
                  <!-- 預覽 -->
                  <div v-if="video.url" class="rounded-lg overflow-hidden w-full max-w-xs">
                    <!-- IG 連結 -->
                    <a v-if="video.url.includes('instagram.com')"
                       :href="video.url" target="_blank"
                       class="flex flex-col items-center justify-center gap-2 py-4 rounded-lg
                              bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 transition-opacity">
                      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      <p class="text-white text-xs font-medium">點擊前往 Instagram</p>
                    </a>
                    <!-- 一般 iframe -->
                    <div v-else class="aspect-video">
                      <iframe :src="toEmbedUrl(video.url)" class="w-full h-full" allowfullscreen></iframe>
                    </div>
                  </div>
                </div>
                <!-- 刪除 -->
                <button @click="removeVideoRow(idx)"
                        class="mt-2 p-1.5 text-stone-300 hover:text-red-400 transition-colors flex-none">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增照片資料夾 Modal -->
    <div v-if="mkdirModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="font-bold text-base text-stone-800 dark:text-stone-100 mb-4">新增照片資料夾</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">年份</label>
            <input v-model="mkdirModal.year" placeholder="例：2026"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">活動</label>
            <input v-model="mkdirModal.event" placeholder="例：第1回"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">天數</label>
            <input v-model="mkdirModal.day" placeholder="例：第1天"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="mkdirModal.show = false" class="px-4 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">取消</button>
          <button @click="doMkdir" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">建立</button>
        </div>
      </div>
    </div>

    <!-- 新增影片資料夾 Modal -->
    <div v-if="newVideoModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="font-bold text-base text-stone-800 dark:text-stone-100 mb-4">新增影片資料夾</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">年份</label>
            <input v-model="newVideoModal.year" placeholder="例：2026"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">活動</label>
            <input v-model="newVideoModal.event" placeholder="例：第1回"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">天數</label>
            <input v-model="newVideoModal.day" placeholder="例：第1天"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-5">
          <button @click="newVideoModal.show = false" class="px-4 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">取消</button>
          <button @click="doCreateVideoFolder" class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">建立</button>
        </div>
      </div>
    </div>

    <!-- 刪除照片確認 -->
    <div v-if="showDeleteImg" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <p class="text-stone-500 dark:text-stone-400 mb-2">確定要刪除這張照片？</p>
        <p class="text-xs text-stone-400 mb-5 break-all">{{ deleteImgTarget }}</p>
        <div class="flex justify-center gap-3">
          <button @click="doDeleteImg" class="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl">確定刪除</button>
          <button @click="showDeleteImg = false" class="px-5 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl">取消</button>
        </div>
      </div>
    </div>

    <!-- 刪除影片確認 -->
    <div v-if="showDeleteVideo" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <p class="text-stone-500 dark:text-stone-400 mb-5">確定要移除這筆影片？</p>
        <div class="flex justify-center gap-3">
          <button @click="doDeleteVideoRow" class="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl">確定移除</button>
          <button @click="showDeleteVideo = false" class="px-5 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl">取消</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast.show"
           :class="toast.error ? 'bg-red-700' : 'bg-stone-800'"
           class="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
        <svg class="w-4 h-4 flex-shrink-0" :class="toast.error ? 'text-red-200' : 'text-green-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!toast.error" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>