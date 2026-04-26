<script setup lang="js">
import { useLinkStore } from '~/stores/link'

definePageMeta({ layout: 'admin' })

const linkStore = useLinkStore()
const loading = ref(false)
const saving  = ref(false)
const toast   = reactive({ show: false, message: '', error: false })
const modal   = reactive({ show: false, mode: 'add' })
const showDeleteConfirm = ref(false)
const deleteTarget = reactive({ id: '', name: '' })

const form = reactive({
  id: '',
  name: '',
  url: '',
  desc: '',
  icon: '🔗',
  visible: true,
  sort: 0,
})

const showToast = (msg, error = false) => {
  toast.message = msg;
  toast.error = error;
  toast.show = true
  setTimeout(() => toast.show = false, 2500)
}

onMounted(async () => {
  loading.value = true
  await linkStore.refreshLink()
  loading.value = false
})

const refresh = async () => {
  loading.value = true
  await linkStore.refreshLink()
  loading.value = false
}

const openAdd = () => {
  Object.assign(form, {id: '', name: '', url: '', desc: '', icon: '🔗', visible: true, sort: 0})
  modal.mode = 'add'
  modal.show = true
}

const openEdit = (link) => {
  Object.assign(form, {...link})
  modal.mode = 'edit'
  modal.show = true
}

const save = async () => {
  if (!form.name.trim()) {
    showToast('請填寫名稱', true);
    return
  }
  if (!form.url.trim()) {
    showToast('請填寫網址', true);
    return
  }
  saving.value = true
  try {
    linkStore.data.edit_link = {...form}
    if (modal.mode === 'add') {
      await linkStore.add()
      showToast('新增成功')
    } else {
      await linkStore.update()
      showToast('儲存成功')
    }
    modal.show = false
  } catch {
    showToast('操作失敗', true)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (link) => {
  deleteTarget.id = link.id
  deleteTarget.name = link.name
  showDeleteConfirm.value = true
}

const doDelete = async () => {
  await linkStore.remove(deleteTarget.id)
  showDeleteConfirm.value = false
  showToast('已刪除')
}

const commonIcons = ['🔗', '⛪', '▶️', '🗣️', '🌳', '📖', '🎵', '📧', '🌐', '📱', '💻', '❤️']
</script>

<template>
  <div class="dark:bg-black bg-gray-50 min-h-screen container-top">
    <div class="max-w-3xl mx-auto px-4 py-5">

      <!-- 工具列 -->
      <div class="flex items-center justify-between mb-5">
        <p class="text-black dark:text-white text-2xl sm:text-4xl font-bold">連結管理</p>
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
            新增連結
          </button>
        </div>
      </div>

      <!-- 讀取中 -->
      <div v-if="loading" class="flex items-center justify-center py-20 gap-2 text-stone-400">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        載入中…
      </div>

      <!-- 無資料 -->
      <div v-else-if="linkStore.data.link_list.length === 0"
           class="text-center py-16 text-stone-400 text-sm">
        目前沒有連結，點「新增連結」開始新增
      </div>

      <!-- 列表 -->
      <div v-else
           class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div v-for="(link, idx) in linkStore.data.link_list" :key="link.id">
          <div class="flex items-center gap-3 px-4 py-3">
            <!-- favicon + emoji fallback -->
            <div class="w-9 h-9 flex-none flex items-center justify-center">
              <img
                  v-if="link.url"
                  :src="`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(link.url).hostname } catch { return '' } })()}&sz=64`"
                  :alt="link.name"
                  class="w-7 h-7 rounded"
                  @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }"
              />
              <span class="text-2xl flex items-center justify-center"
                    :style="link.url ? 'display:none' : ''">{{ link.icon }}</span>
            </div>
            <!-- 文字 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-sm sm:text-base text-stone-800 dark:text-stone-100 truncate">{{
                    link.name
                  }}</p>
                <span v-if="link.visible === false"
                      class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 flex-none">隱藏</span>
              </div>
              <p class="text-xs text-stone-400 truncate mt-0.5">{{ link.url }}</p>
              <p v-if="link.desc" class="text-xs text-stone-400 mt-0.5">{{ link.desc }}</p>
            </div>
            <!-- 排序 -->
            <span class="text-xs text-stone-300 dark:text-stone-600 flex-none">{{ link.sort }}</span>
            <!-- 操作 -->
            <div class="flex gap-2 flex-none">
              <button @click="openEdit(link)"
                      class="px-2.5 py-1 text-xs rounded-lg border border-blue-200 dark:border-blue-800
                             text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                編輯
              </button>
              <button @click="confirmDelete(link)"
                      class="px-2.5 py-1 text-xs rounded-lg border border-red-200 dark:border-red-800
                             text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                刪除
              </button>
            </div>
          </div>
          <div v-if="idx < linkStore.data.link_list.length - 1"
               class="border-b border-dashed border-stone-100 dark:border-zinc-800 mx-4"></div>
        </div>
      </div>
    </div>

    <!-- ════════ 新增／編輯 Modal ════════ -->
    <div v-if="modal.show"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-0 sm:p-4">
      <div
          class="bg-white dark:bg-zinc-900 rounded-b-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-screen sm:max-h-[90vh] overflow-y-auto">

        <div
            class="px-5 py-4 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 class="font-bold text-base text-stone-800 dark:text-stone-100">
            {{ modal.mode === 'add' ? '新增連結' : '編輯連結' }}
          </h3>
          <button @click="modal.show = false" class="text-stone-400 hover:text-stone-600 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-5 py-4 space-y-4">

          <!-- 名稱 -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">名稱 *</label>
            <input v-model="form.name" placeholder="連結名稱"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <!-- 網址 -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">網址 *</label>
            <input v-model="form.url" placeholder="https://..." type="url"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <!-- 說明 + 排序 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">說明文字</label>
              <input v-model="form.desc" placeholder="簡短說明"
                     class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
            </div>
            <div>
              <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">排序（小的在前）</label>
              <input v-model.number="form.sort" type="number" min="0"
                     class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
            </div>
          </div>

          <!-- Icon 選擇 -->
          <div>
            <label class="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-2">Icon</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <button
                  v-for="ic in commonIcons" :key="ic"
                  type="button"
                  @click="form.icon = ic"
                  :class="form.icon === ic
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700'"
                  class="w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-colors">
                {{ ic }}
              </button>
            </div>
            <input v-model="form.icon" placeholder="或直接輸入 emoji"
                   class="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400"/>
          </div>

          <!-- 前台顯示 -->
          <div
              class="flex items-center justify-between py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-zinc-800">
            <div>
              <p class="text-xs font-semibold text-stone-700 dark:text-stone-200">前台顯示</p>
              <p class="text-xs text-stone-400">關閉後訪客看不到此連結</p>
            </div>
            <button @click="form.visible = !form.visible"
                    :class="form.visible ? 'bg-blue-600' : 'bg-stone-300 dark:bg-zinc-600'"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200">
              <span :class="form.visible ? 'translate-x-5' : 'translate-x-0.5'"
                    class="inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transform transition-transform duration-200"></span>
            </button>
          </div>
        </div>

        <div
            class="px-5 py-4 border-t border-stone-100 dark:border-stone-700 flex gap-2 justify-end sticky bottom-0 bg-white dark:bg-zinc-900">
          <button @click="modal.show = false"
                  class="px-4 py-2 text-sm bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">
            取消
          </button>
          <button @click="save" :disabled="saving"
                  class="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
            <div v-if="saving"
                 class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ modal.mode === 'add' ? '新增' : '儲存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 刪除確認 -->
    <div v-if="showDeleteConfirm"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <p class="text-stone-500 dark:text-stone-400 mb-1">你確定要刪除</p>
        <p class="text-xl font-black text-red-500 my-2">{{ deleteTarget.name }}</p>
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