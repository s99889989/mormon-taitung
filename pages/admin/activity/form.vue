<script setup lang="js">
import { useActiveStore } from '~/stores/active'
import { useImageStore } from '~/stores/image'
import { initFlowbite } from 'flowbite'

definePageMeta({ layout: 'admin' })

const activeStore = useActiveStore()
const imageStore = useImageStore()
const route = useRoute()

const isEdit = computed(() => route.path.includes('edit'))
const pageTitle = computed(() => isEdit.value ? '編輯活動' : '新增活動')

onMounted(async () => {
  if (!isEdit.value) {
    activeStore.initNewActive()
  }
  initFlowbite()
})

const active = computed(() => activeStore.data.edit_active)

// 照片上傳
const uploading = ref(false)
const uploadImage = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(
      `https://madustrialtd.asuscomm.com:8080/image/add/mormon__image__active__${active.value.date || 'general'}`,
      { method: 'POST', body: formData }
    )
    const imageName = await res.text()
    const url = `https://madustrialtd.asuscomm.com:8080/mormon/image/active/${active.value.date || 'general'}/${imageName}`
    if (!active.value.images) active.value.images = []
    active.value.images.push(url)
  } catch (err) {
    alert('上傳失敗：' + err.message)
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

const removeImage = (idx) => {
  active.value.images.splice(idx, 1)
}

const handleSubmit = async () => {
  if (isEdit.value) {
    await activeStore.update()
  } else {
    await activeStore.add()
  }
  await navigateTo('/admin/activity/list')
}
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <div class="grid gap-5 grid-cols-1 items-center pt-5 px-5">

        <span class="text-center text-4xl font-medium text-gray-900 dark:text-white">{{ pageTitle }}</span>

        <!-- 固定/非固定 -->
        <div class="flex items-center gap-3">
          <label class="w-48 text-2xl font-medium text-gray-900 dark:text-white">固定時間活動</label>
          <select v-model="active.fixed"
            class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option :value="false">否</option>
            <option :value="true">是</option>
          </select>
        </div>

        <!-- 禮拜幾（固定活動） -->
        <div v-if="active.fixed" class="flex items-center gap-3">
          <label class="w-48 text-2xl font-medium text-gray-900 dark:text-white">禮拜幾</label>
          <select v-model="active.week"
            class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option v-for="d in ['禮拜一','禮拜二','禮拜三','禮拜四','禮拜五','禮拜六','禮拜日','每個月一次']" :key="d">{{ d }}</option>
          </select>
        </div>

        <!-- 日期時間（非固定） -->
        <template v-if="!active.fixed">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <label class="w-32 text-2xl font-medium text-gray-900 dark:text-white">開始日期</label>
              <input v-model="active.date" type="date"
                class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="flex items-center gap-3">
              <label class="w-32 text-2xl font-medium text-gray-900 dark:text-white">開始時間</label>
              <input v-model="active.time" type="time"
                class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="flex items-center gap-3">
              <label class="w-32 text-2xl font-medium text-gray-900 dark:text-white">結束日期</label>
              <input v-model="active.end_date" type="date"
                class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="flex items-center gap-3">
              <label class="w-32 text-2xl font-medium text-gray-900 dark:text-white">結束時間</label>
              <input v-model="active.end_time" type="time"
                class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
          </div>
        </template>

        <!-- 狀態 -->
        <div class="flex items-center gap-3">
          <label class="w-48 text-2xl font-medium text-gray-900 dark:text-white">狀態</label>
          <select v-model="active.states"
            class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option v-for="s in ['規劃中','尚未開始','活動中','結束']" :key="s">{{ s }}</option>
          </select>
        </div>

        <!-- 活動名稱 -->
        <div class="flex items-center gap-3">
          <label class="w-48 text-2xl font-medium text-gray-900 dark:text-white">活動名稱</label>
          <input v-model="active.name" type="text"
            class="flex-1 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <!-- 活動地點 -->
        <div class="flex items-center gap-3">
          <label class="w-48 text-2xl font-medium text-gray-900 dark:text-white">活動地點</label>
          <input v-model="active.location" type="text"
            class="flex-1 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <!-- 詳細說明 -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-medium text-gray-900 dark:text-white">詳細說明</label>
          <textarea v-model="active.info" rows="6"
            class="w-full text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-y"
            placeholder="活動詳細說明..."></textarea>
        </div>

        <!-- 照片上傳 -->
        <div class="flex flex-col gap-3">
          <label class="text-2xl font-medium text-gray-900 dark:text-white">活動照片</label>

          <!-- 上傳按鈕 -->
          <label class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800">
            <div class="flex flex-col items-center gap-2">
              <svg v-if="!uploading" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <svg v-else class="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ uploading ? '上傳中...' : '點擊上傳照片' }}
              </span>
            </div>
            <input type="file" accept="image/*" class="hidden" @change="uploadImage" :disabled="uploading" />
          </label>

          <!-- 已上傳照片 -->
          <div v-if="active.images && active.images.length > 0"
            class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))">
            <div v-for="(img, idx) in active.images" :key="idx"
              class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img :src="img" class="w-full h-full object-cover" alt="活動照片" />
              <button @click="removeImage(idx)"
                class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full
                       opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- 送出 / 取消 -->
        <div class="grid grid-cols-2 gap-4 pb-10">
          <button @click="handleSubmit"
            class="text-center text-2xl text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-5 py-3">
            {{ isEdit ? '儲存' : '新增' }}
          </button>
          <NuxtLink to="/admin/activity/list"
            class="text-center text-2xl text-white bg-gray-700 hover:bg-gray-600 font-medium rounded-lg px-5 py-3">
            取消
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>
