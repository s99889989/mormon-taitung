<script setup lang="js">
import { useHtmlPageStore } from '~/stores/html_page'

definePageMeta({ layout: 'admin' })

const htmlPageStore = useHtmlPageStore()
const loading = ref(false)
const saving  = ref(false)
const toast   = reactive({ show: false, message: '', error: false })
const modal    = reactive({ show: false })
const showDeleteConfirm = ref(false)
const deleteTarget = reactive({ slug: '', title: '' })

const form = reactive({
  slug:  '',
  title: '',
  file:  null,
})
const fileInputRef = ref(null)
const fileName = ref('')

const showToast = (msg, error = false) => {
  toast.message = msg
  toast.error   = error
  toast.show    = true
  setTimeout(() => toast.show = false, 2500)
}

onMounted(async () => {
  loading.value = true
  await htmlPageStore.refreshPages()
  loading.value = false
})

const refresh = async () => {
  loading.value = true
  await htmlPageStore.refreshPages()
  loading.value = false
}

const openAdd = () => {
  form.slug  = ''
  form.title = ''
  form.file  = null
  fileName.value = ''
  modal.show = true
}

const onFileChange = (e) => {
  const f = e.target.files[0]
  if (!f) return
  form.file = f
  fileName.value = f.name
  // 自動填入 slug（去掉副檔名）
  if (!form.slug) {
    form.slug = f.name.replace(/\.html?$/i, '').replace(/\s+/g, '-').toLowerCase()
  }
}

const save = async () => {
  if (!form.slug.trim()) { showToast('請填寫網址代稱 (slug)', true); return }
  if (!form.title.trim()) { showToast('請填寫標題', true); return }
  if (!form.file)         { showToast('請選擇 HTML 檔案', true); return }

  // slug 只允許英數與 dash
  if (!/^[a-z0-9\-_]+$/i.test(form.slug)) {
    showToast('網址代稱只能使用英文、數字、橫線', true)
    return
  }

  saving.value = true
  try {
    await htmlPageStore.upload(form.slug.trim(), form.title.trim(), form.file)
    showToast('上傳成功')
    modal.show = false
  } catch {
    showToast('上傳失敗', true)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (page) => {
  deleteTarget.slug  = page.slug
  deleteTarget.title = page.title
  showDeleteConfirm.value = true
}

const doDelete = async () => {
  await htmlPageStore.remove(deleteTarget.slug)
  showDeleteConfirm.value = false
  showToast('已刪除')
}

const copyUrl = (slug) => {
  const url = `${window.location.origin}/html/${slug}`
  navigator.clipboard.writeText(url)
  showToast('網址已複製')
}
</script>

<template>
  <div class="dark:bg-black bg-gray-50 min-h-screen container-top">
    <div class="max-w-3xl mx-auto px-4 py-5">

      <!-- 工具列 -->
      <div class="flex items-center justify-between mb-5">
        <p class="text-black dark:text-white text-2xl sm:text-4xl font-bold">HTML 頁面管理</p>
        <div class="flex gap-2">
          <button @click="refresh"
                  class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            刷新
          </button>
          <button @click="openAdd"
                  class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            上傳 HTML
          </button>
        </div>
      </div>

      <!-- 讀取中 -->
      <div v-if="loading" class="flex items-center justify-center py-20 gap-2 text-stone-400">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        載入中…
      </div>

      <!-- 無資料 -->
      <div v-else-if="htmlPageStore.data.page_list.length === 0"
           class="text-center py-16 text-stone-400 text-sm">
        目前沒有頁面，點「上傳 HTML」開始新增
      </div>

      <!-- 列表 -->
      <div v-else
           class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div v-for="(page, idx) in htmlPageStore.data.page_list" :key="page.slug">
          <div class="flex items-center gap-3 px-4 py-3">
            <!-- 圖示 -->
            <div class="w-9 h-9 flex-none flex items-center justify-center text-2xl">📄</div>
            <!-- 文字 -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm sm:text-base text-stone-800 dark:text-stone-100 truncate">
                {{ page.title }}
              </p>
              <p class="text-xs text-stone-400 truncate mt-0.5 font-mono">/html/{{ page.slug }}</p>
            </div>
            <!-- 操作 -->
            <div class="flex gap-2 flex-none">
              <a :href="`/html/${page.slug}`" target="_blank"
                 class="px-2.5 py-1 text-xs rounded-lg border border-green-200 dark:border-green-800
                        text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                查看
              </a>
              <button @click="copyUrl(page.slug)"
                      class="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700
                             text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                複製網址
              </button>
              <button @click="confirmDelete(page)"
                      class="px-2.5 py-1 text-xs rounded-lg border border-red-200 dark:border-red-800
                             text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                刪除
              </button>
            </div>
          </div>
          <div v-if="idx < htmlPageStore.data.page_list.length - 1"
               class="border-b border-dashed border-stone-100 dark:border-zinc-800 mx-4"></div>
        </div>
      </div>
    </div>

    <!-- ════════ 上傳 Modal ════════ -->
    <div v-if="modal.show"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-b-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-screen sm:max-h-[90vh] overflow-y-auto">

        <div class="px-5 py-4 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 class="font-bold text-base text-stone-800 dark:text-stone-100">上傳 HTML 頁面</h3>
          <button @click="modal.show = false" class="text-stone-400 hover:text-stone-600 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-5 py-4 space-y-4">

          <!-- 標題 -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">頁面標題 *</label>
            <input v-model="form.title" placeholder="顯示用的標題"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <!-- Slug -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
              網址代稱 (slug) * <span class="font-normal text-stone-400">— 只能英文、數字、橫線</span>
            </label>
            <div class="flex items-center gap-1.5">
              <span class="text-xs text-stone-400 font-mono whitespace-nowrap">/html/</span>
              <input v-model="form.slug" placeholder="example-page"
                     class="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400 font-mono"/>
            </div>
          </div>

          <!-- 檔案 -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-2">HTML 檔案 *</label>
            <label
                class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                :class="form.file
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-700'">
              <div class="flex flex-col items-center gap-1 text-center px-4">
                <svg class="w-7 h-7" :class="form.file ? 'text-blue-500' : 'text-stone-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                </svg>
                <p v-if="!form.file" class="text-xs text-stone-500 dark:text-stone-400">
                  點擊選擇 <span class="font-semibold text-blue-600">.html</span> 檔案
                </p>
                <p v-else class="text-xs font-semibold text-blue-600 truncate max-w-xs">{{ fileName }}</p>
              </div>
              <input ref="fileInputRef" type="file" accept=".html,.htm" class="hidden" @change="onFileChange"/>
            </label>
          </div>

        </div>

        <div class="px-5 py-4 border-t border-stone-100 dark:border-stone-700 flex gap-2 justify-end sticky bottom-0 bg-white dark:bg-zinc-900">
          <button @click="modal.show = false"
                  class="px-4 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">
            取消
          </button>
          <button @click="save" :disabled="saving"
                  class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
            <div v-if="saving" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            上傳
          </button>
        </div>
      </div>
    </div>

    <!-- 刪除確認 -->
    <div v-if="showDeleteConfirm"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <p class="text-stone-500 dark:text-stone-400 mb-1">你確定要刪除</p>
        <p class="text-xl font-black text-red-500 my-2">{{ deleteTarget.title }}</p>
        <p class="text-stone-500 dark:text-stone-400 mb-6">嗎？</p>
        <div class="flex justify-center gap-3">
          <button @click="doDelete"
                  class="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors">
            確定刪除
          </button>
          <button @click="showDeleteConfirm = false"
                  class="px-5 py-2 text-sm font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast.show"
           :class="toast.error ? 'bg-red-700' : 'bg-stone-800'"
           class="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
        <svg class="w-4 h-4 flex-shrink-0" :class="toast.error ? 'text-red-200' : 'text-green-400'" fill="none"
             stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!toast.error" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
