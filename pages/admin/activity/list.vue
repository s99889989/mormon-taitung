<script setup lang="js">
import { useActiveStore } from '~/stores/active'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'

definePageMeta({ layout: 'admin' })

const activeStore = useActiveStore()

// ── 狀態 ──────────────────────────────────────────────────────────
const loading   = ref(false)
const saving    = ref(false)
const uploading = ref(false)
const toast     = reactive({ show: false, message: '', error: false })
const modal     = reactive({ show: false })

const coverInputRef  = ref(null)
const attachInputRef = ref(null)
const previewUrl     = ref('')
const tagInput       = ref('')

const emptyForm = () => ({
  date:                '',
  name:                '',
  info:                '',
  visible:             true,
  showInFrontCategory: false,
  images:              [],
  attachments:         [],
  newAttachFiles:      [],
  coverPreview:        '',
  tags:                [],
})

const form = reactive(emptyForm())

// 刪除確認
const deleteTarget      = reactive({ date: '', time: '', name: '' })
const showDeleteConfirm = ref(false)

// ── 工具 ──────────────────────────────────────────────────────────
const showToast = (msg, error = false) => {
  toast.message = msg; toast.error = error; toast.show = true
  setTimeout(() => toast.show = false, 2500)
}
const todayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
const apiBase = () => 'https://madustrialtd.asuscomm.com:8080'

// ── 標籤 ──────────────────────────────────────────────────────────
const addTag = () => {
  const t = tagInput.value.trim()
  if (t && !form.tags.includes(t)) form.tags.push(t)
  tagInput.value = ''
}

// ── 連結 popup ────────────────────────────────────────────────────
const linkPopup = reactive({ show: false, url: '' })
const openLinkPopup = () => {
  linkPopup.url = editor.value?.getAttributes('link').href || ''
  linkPopup.show = true
}
const applyLink = () => {
  if (!linkPopup.url.trim()) editor.value?.chain().focus().unsetLink().run()
  else editor.value?.chain().focus().setLink({ href: linkPopup.url.trim(), target: '_blank' }).run()
  linkPopup.show = false
}
const removeLink = () => {
  editor.value?.chain().focus().unsetLink().run()
  linkPopup.show = false
}

// ── Tiptap ────────────────────────────────────────────────────────
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false, HTMLAttributes: { class: 'tiptap-link' } }),
  ],
  content: '',
  onUpdate: ({ editor }) => { form.info = editor.getHTML() },
  editorProps: { attributes: { class: 'outline-none' } },
})
watch(() => modal.show, (show) => {
  if (show) nextTick(() => editor.value?.commands.setContent(form.info || ''))
})
onBeforeUnmount(() => editor.value?.destroy())

// ── 載入 ──────────────────────────────────────────────────────────
onMounted(async () => {
  loading.value = true
  await activeStore.refreshActive()
  loading.value = false
})
const refresh = async () => {
  loading.value = true
  await activeStore.refreshActive()
  loading.value = false
}

// ── Modal 開啟 ─────────────────────────────────────────────────────
const openAdd = () => {
  Object.assign(form, emptyForm())
  form.date = todayDate()
  tagInput.value = ''
  modal.show = true
}

// ── 封面圖 ────────────────────────────────────────────────────────
const handleCoverSelect = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.coverPreview = URL.createObjectURL(file)
  uploading.value = true
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await fetch(
        `${apiBase()}/image/add/mormon__image__active__${form.date || 'general'}`,
        { method: 'POST', body: fd }
    )
    const imageName = await res.text()
    const url = `${apiBase()}/mormon/image/active/${form.date || 'general'}/${imageName}`
    form.images = [url, ...form.images.slice(1)]
  } catch { showToast('封面上傳失敗', true) }
  finally { uploading.value = false; if (coverInputRef.value) coverInputRef.value.value = '' }
}
const removeCover = () => {
  form.images = form.images.slice(1)
  form.coverPreview = ''
  if (coverInputRef.value) coverInputRef.value.value = ''
}

// ── 附件 ──────────────────────────────────────────────────────────
const handleAttachSelect = (e) => {
  const files = Array.from(e.target.files)
  for (const f of files) {
    form.newAttachFiles.push(f)
    form.attachments.push({ name: f.name, url: '', isNew: true })
  }
  if (attachInputRef.value) attachInputRef.value.value = ''
}
const removeAttachment = (idx) => {
  const isNew = form.attachments[idx]?.isNew
  form.attachments.splice(idx, 1)
  if (isNew) {
    const newIdx = form.attachments.slice(0, idx).filter(a => a.isNew).length
    form.newAttachFiles.splice(newIdx, 1)
  }
}

// ── 儲存 ──────────────────────────────────────────────────────────
const save = async () => {
  if (!form.name.trim()) { showToast('請填寫活動名稱', true); return }
  saving.value = true
  try {
    for (const f of form.newAttachFiles) {
      const fd = new FormData()
      fd.append('file', f)
      const res = await fetch(
          `${apiBase()}/image/add/mormon__attach__active__${form.date || 'general'}`,
          { method: 'POST', body: fd }
      )
      const fileName = await res.text()
      const url = `${apiBase()}/mormon/image/active/${form.date || 'general'}/${fileName}`
      const idx = form.attachments.findIndex(a => a.isNew && a.name === f.name)
      if (idx !== -1) { form.attachments[idx].url = url; form.attachments[idx].isNew = false }
    }
    activeStore.data.edit_active = {
      fixed:       false,
      week:        '',
      date:        form.date,
      time:        '',
      end_date:    '',
      end_time:    '',
      name:        form.name,
      location:    '',
      info:        form.info,
      states:      '尚未開始',
      visible:     form.visible,
      showInFrontCategory: form.showInFrontCategory,
      images:      form.images,
      attachments: form.attachments.filter(a => !a.isNew),
      tags:        form.tags,
    }
    await activeStore.add()
    showToast('新增成功')
    modal.show = false
  } catch { showToast('新增失敗', true) }
  finally { saving.value = false }
}

// ── 刪除 ──────────────────────────────────────────────────────────
const confirmDelete = (active) => {
  deleteTarget.date = active.date; deleteTarget.time = active.time; deleteTarget.name = active.name
  showDeleteConfirm.value = true
}
const doDelete = async () => {
  await activeStore.remove(deleteTarget.date, deleteTarget.time)
  showDeleteConfirm.value = false
  showToast('已刪除')
}
</script>

<template>
  <div class="dark:bg-black bg-gray-50 min-h-screen container-top">
    <div class="max-w-4xl mx-auto px-4 py-5">

      <!-- 工具列 -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <p class="text-black dark:text-white text-2xl sm:text-4xl font-bold">活動列表</p>
          <div class="flex items-center gap-2">
            <button @click="refresh"
                    class="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
              刷新
            </button>
            <button @click="openAdd"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              新增活動
            </button>
          </div>
        </div>
        <!-- 篩選列 -->
        <div class="flex flex-wrap gap-2">
          <select v-model="activeStore.data.search_year"
                  class="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-0">
            <option>所有年份</option>
            <option v-for="y in activeStore.usedYears" :key="y">{{ y }}</option>
          </select>
          <select v-model="activeStore.data.search_tag"
                  class="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-0">
            <option value="">所有標籤</option>
            <option v-for="tag in activeStore.usedTags" :key="tag">{{ tag }}</option>
          </select>
          <select v-model="activeStore.data.search_visible"
                  class="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1 min-w-0">
            <option value="">前台顯示</option>
            <option value="show">顯示</option>
            <option value="hide">隱藏</option>
          </select>
        </div>
      </div>

      <!-- 標籤篩選提示 -->
      <div v-if="activeStore.data.search_tag" class="flex items-center gap-2 mb-3">
        <span class="text-xs text-stone-400">篩選中：</span>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
          {{ activeStore.data.search_tag }}
          <button @click="activeStore.data.search_tag = ''" class="hover:text-blue-900 ml-0.5">✕</button>
        </span>
      </div>

      <!-- 讀取中 -->
      <div v-if="loading" class="flex items-center justify-center py-20 gap-2 text-stone-400">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        載入中…
      </div>

      <!-- 無資料 -->
      <div v-else-if="activeStore.activeList.length === 0"
           class="text-center py-16 text-stone-400 text-sm sm:text-xl">
        目前沒有符合條件的活動
      </div>

      <!-- 列表 -->
      <div v-else class="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div v-for="(active, idx) in activeStore.activeList" :key="`${active.date}-${active.time}`">
          <div class="flex items-center gap-4 px-4 py-3">
            <!-- 縮圖 -->
            <div class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800">
              <img v-if="active.images && active.images.length > 0"
                   :src="active.images[0]" :alt="active.name" class="w-full h-full object-cover"
                   @click="previewUrl = active.images[0]" />
              <div v-else class="w-full h-full flex items-center justify-center text-stone-300 dark:text-zinc-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <!-- 文字 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-semibold text-base sm:text-2xl text-stone-800 dark:text-stone-100 truncate">{{ active.name }}</p>
                <span v-if="active.visible === false"
                      class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400">隱藏</span>
              </div>
              <p class="text-xs sm:text-xl text-stone-400 mt-0.5">
                {{ active.date }}
                <span v-if="active.attachments?.length" class="ml-1.5">📎 {{ active.attachments.length }}</span>
              </p>
              <div v-if="active.tags && active.tags.length" class="flex flex-wrap gap-1 mt-1.5">
                <span v-for="tag in active.tags" :key="tag"
                      class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-100 transition-colors"
                      @click="activeStore.data.search_tag = tag">
                  {{ tag }}
                </span>
              </div>
            </div>
            <!-- 操作 -->
            <div class="flex gap-2 flex-shrink-0">
              <NuxtLink :to="`/admin/activity/edit`"
                        @click="activeStore.setEditActive(active.date, active.time)"
                        class="px-2 sm:px-2.5 py-1 text-xs sm:text-xl rounded-lg border border-blue-200 dark:border-blue-800
                               text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                編輯
              </NuxtLink>
              <button @click="confirmDelete(active)"
                      class="px-2 sm:px-2.5 py-1 text-xs sm:text-xl rounded-lg border border-red-200 dark:border-red-800
                             text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                刪除
              </button>
            </div>
          </div>
          <div v-if="idx < activeStore.activeList.length - 1"
               class="border-b border-dashed border-stone-100 dark:border-zinc-800 mx-4"></div>
        </div>
      </div>
    </div>

    <!-- ════════ 新增 Modal ════════ -->
    <div v-if="modal.show"
         class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white dark:bg-zinc-900 rounded-b-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-screen sm:max-h-[92vh] overflow-y-auto">

        <div class="px-5 py-4 border-b border-stone-100 dark:border-stone-700 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 class="font-bold text-base sm:text-2xl text-stone-800 dark:text-stone-100">新增活動</h3>
          <button @click="modal.show = false" class="text-stone-400 hover:text-stone-600 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-5 py-4 space-y-4">

          <!-- 標題 -->
          <div>
            <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">標題 *</label>
            <input v-model="form.name" placeholder="活動名稱"
                   class="w-full px-3 py-2 text-sm sm:text-2xl rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <!-- 日期 + 分類標籤 -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">日期</label>
              <input v-model="form.date" type="date"
                     class="w-full px-3 py-2 text-sm sm:text-xl rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">分類標籤</label>
              <div class="flex gap-1.5">
                <input v-model="tagInput" placeholder="輸入後按 Enter"
                       @keydown.enter.prevent="addTag"
                       class="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-800 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="button" @click="addTag"
                        class="px-3 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">+</button>
              </div>
              <!-- 已使用的標籤（快速選擇） -->
              <div v-if="activeStore.usedTags.length" class="flex flex-wrap gap-1.5 mt-2">
                <button
                    v-for="tag in activeStore.usedTags" :key="tag"
                    type="button"
                    @click="!form.tags.includes(tag) && form.tags.push(tag)"
                    :class="form.tags.includes(tag)
                    ? 'bg-blue-600 text-white opacity-50 cursor-default'
                    : 'bg-stone-100 dark:bg-zinc-700 text-stone-600 dark:text-stone-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300'"
                    class="px-2 py-0.5 rounded-full text-xs transition-colors">
                  {{ tag }}
                </button>
              </div>
              <!-- 已選標籤 -->
              <div v-if="form.tags.length" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="(tag, idx) in form.tags" :key="tag"
                      class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {{ tag }}
                  <button type="button" @click="form.tags.splice(idx, 1)" class="hover:text-red-400 leading-none">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- 前台顯示 -->
          <div class="flex items-center justify-between py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-zinc-800">
            <div>
              <p class="text-xs sm:text-xl font-semibold text-stone-700 dark:text-stone-200">前台顯示</p>
              <p class="text-xs text-stone-400">關閉後訪客看不到此活動</p>
            </div>
            <button @click="form.visible = !form.visible"
                    :class="form.visible ? 'bg-blue-600' : 'bg-stone-300 dark:bg-zinc-600'"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200">
              <span :class="form.visible ? 'translate-x-5' : 'translate-x-0.5'"
                    class="inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transform transition-transform duration-200"></span>
            </button>
          </div>



          <!-- 封面圖 -->
          <div>
            <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">封面圖</label>
            <div v-if="form.coverPreview || form.images[0]"
                 class="relative w-full h-40 rounded-xl overflow-hidden mb-2 border border-stone-200 dark:border-stone-700">
              <img :src="form.coverPreview || form.images[0]" class="w-full h-full object-cover" />
              <button @click="removeCover"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
            </div>
            <div @click="coverInputRef?.click()"
                 class="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <p class="text-sm text-stone-400">{{ uploading ? '上傳中...' : '點擊上傳封面圖' }}</p>
              <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverSelect" />
            </div>
          </div>

          <!-- Tiptap 內文 -->
          <div>
            <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">內文</label>
            <div class="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border border-stone-200 dark:border-stone-700 border-b-0 rounded-t-xl bg-stone-50 dark:bg-zinc-800">
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
                      :class="editor?.isActive('heading', { level: 2 }) ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="px-2 py-1 rounded text-xs font-bold transition-colors">H2</button>
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
                      :class="editor?.isActive('heading', { level: 3 }) ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="px-2 py-1 rounded text-xs font-bold transition-colors">H3</button>
              <div class="w-px h-4 bg-stone-200 mx-1"></div>
              <button type="button" @click="editor?.chain().focus().toggleBold().run()"
                      :class="editor?.isActive('bold') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="px-2 py-1 rounded text-xs font-bold transition-colors">B</button>
              <button type="button" @click="editor?.chain().focus().toggleItalic().run()"
                      :class="editor?.isActive('italic') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="px-2 py-1 rounded text-xs italic font-semibold transition-colors">I</button>
              <button type="button" @click="editor?.chain().focus().toggleUnderline().run()"
                      :class="editor?.isActive('underline') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="px-2 py-1 rounded text-xs underline font-semibold transition-colors">U</button>
              <div class="w-px h-4 bg-stone-200 mx-1"></div>
              <button type="button" @click="editor?.chain().focus().setTextAlign('left').run()"
                      :class="editor?.isActive({ textAlign: 'left' }) ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="p-1.5 rounded transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"/></svg>
              </button>
              <button type="button" @click="editor?.chain().focus().setTextAlign('center').run()"
                      :class="editor?.isActive({ textAlign: 'center' }) ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="p-1.5 rounded transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14"/></svg>
              </button>
              <button type="button" @click="editor?.chain().focus().toggleBulletList().run()"
                      :class="editor?.isActive('bulletList') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="p-1.5 rounded transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              </button>
              <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()"
                      :class="editor?.isActive('orderedList') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="p-1.5 rounded transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5h11M9 12h11M9 19h11M5 5v.01M5 12v.01M5 19v.01"/></svg>
              </button>
              <div class="w-px h-4 bg-stone-200 mx-1"></div>
              <!-- 連結按鈕 -->
              <button type="button" @click="openLinkPopup"
                      :class="editor?.isActive('link') ? 'bg-sky-100 text-sky-700' : 'text-stone-500 hover:bg-stone-200'"
                      class="p-1.5 rounded transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </button>
              <div class="w-px h-4 bg-stone-200 mx-1"></div>
              <button type="button" @click="editor?.chain().focus().undo().run()" class="p-1.5 rounded text-stone-500 hover:bg-stone-200 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
              </button>
              <button type="button" @click="editor?.chain().focus().redo().run()" class="p-1.5 rounded text-stone-500 hover:bg-stone-200 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/></svg>
              </button>
            </div>
            <editor-content :editor="editor" class="tiptap-editor" />

            <!-- 連結 popup -->
            <div v-if="linkPopup.show"
                 class="mt-2 p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-zinc-800 flex gap-2 items-center">
              <input v-model="linkPopup.url"
                     placeholder="https://..."
                     @keydown.enter.prevent="applyLink"
                     @keydown.escape="linkPopup.show = false"
                     class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-zinc-900 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-blue-400" />
              <button type="button" @click="applyLink"
                      class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">套用</button>
              <button type="button" @click="removeLink"
                      class="px-3 py-1.5 text-sm bg-stone-200 dark:bg-zinc-700 text-stone-600 dark:text-stone-300 rounded-lg hover:bg-stone-300 transition-colors whitespace-nowrap">移除</button>
              <button type="button" @click="linkPopup.show = false" class="p-1.5 text-stone-400 hover:text-stone-600">✕</button>
            </div>
          </div>

          <!-- 附件 -->
          <div>
            <label class="text-xs sm:text-xl font-semibold text-stone-600 dark:text-stone-300 block mb-1">附件</label>
            <div v-if="form.attachments?.length" class="space-y-1.5 mb-2">
              <div v-for="(att, idx) in form.attachments" :key="idx"
                   class="flex items-center justify-between px-3 py-2 bg-stone-50 dark:bg-zinc-800 rounded-xl text-sm">
                <span class="text-stone-600 dark:text-stone-300 truncate flex-1 mr-2">📎 {{ att.name }}</span>
                <button @click="removeAttachment(idx)" class="text-stone-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div @click="attachInputRef?.click()"
                 class="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <p class="text-sm text-stone-400">點擊上傳附件（可多選）</p>
              <input ref="attachInputRef" type="file" multiple class="hidden" @change="handleAttachSelect" />
            </div>
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
            新增
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
        <p class="text-stone-500 dark:text-stone-400 mb-6">活動嗎？</p>
        <div class="flex justify-center gap-3">
          <button @click="doDelete" class="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors">確定刪除</button>
          <button @click="showDeleteConfirm = false" class="px-5 py-2 text-sm font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 transition-colors">取消</button>
        </div>
      </div>
    </div>

    <!-- 大圖預覽 -->
    <div v-if="previewUrl" class="fixed inset-0 bg-black/85 flex items-center justify-center z-[60] cursor-pointer p-4" @click="previewUrl = ''">
      <img :src="previewUrl" class="max-w-full max-h-full rounded-xl shadow-2xl object-contain" />
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

<style>
.tiptap-editor .ProseMirror {
  min-height: 160px; padding: 8px 12px; font-size: 0.875rem; line-height: 1.6;
  border: 1px solid #e7e5e4; border-radius: 0 0 0.75rem 0.75rem;
  outline: none; background: white; color: #1c1917;
}
.dark .tiptap-editor .ProseMirror { background: #18181b; border-color: #3f3f46; color: #f4f4f5; }
.tiptap-editor .ProseMirror:focus-visible { box-shadow: 0 0 0 2px #38bdf8; }
.tiptap-editor .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 0.75rem 0 0.25rem; }
.tiptap-editor .ProseMirror h3 { font-size: 1.05rem; font-weight: 600; margin: 0.5rem 0 0.25rem; }
.tiptap-editor .ProseMirror p  { margin: 0.2rem 0; }
.tiptap-editor .ProseMirror ul { list-style: disc;    padding-left: 1.5rem; margin: 0.25rem 0; }
.tiptap-editor .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.25rem 0; }
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: '活動詳細內容…'; color: #a8a29e; pointer-events: none; float: left; height: 0;
}
.tiptap-editor .ProseMirror a.tiptap-link {
  color: #3b82f6; text-decoration: underline; cursor: pointer;
}
.dark .tiptap-editor .ProseMirror a.tiptap-link { color: #60a5fa; }
</style>