<script setup lang="ts">
definePageMeta({ layout: 'admin' })

import { API_BASE_URL } from '~/utils/api'

const loading = ref(false)
const saving = ref(false)
const toast = reactive({ show: false, message: '', error: false })

const customers = ref<any[]>([])

const VALID_ROLES = ['MEMBER', 'STAFF', 'EDITOR', 'ADMIN']

const showToast = (msg: string, error = false) => {
  toast.message = msg
  toast.error = error
  toast.show = true
  setTimeout(() => { toast.show = false }, 2500)
}

const refresh = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE_URL}mormon/customer/list`, { credentials: 'include' })
    customers.value = await res.json()
  } catch {
    showToast('載入失敗', true)
  } finally {
    loading.value = false
  }
}

const updateRole = async (id: string, role: string) => {
  saving.value = true
  try {
    const res = await fetch(`${API_BASE_URL}mormon/customer/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    })
    const data = await res.json()
    if (data.error) { showToast(data.error, true); return }
    showToast('已更新 role')
    await refresh()
  } catch {
    showToast('更新失敗', true)
  } finally {
    saving.value = false
  }
}

const updateStatus = async (id: string, status: string) => {
  saving.value = true
  try {
    const res = await fetch(`${API_BASE_URL}mormon/customer/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.error) { showToast(data.error, true); return }
    showToast('已更新狀態')
    await refresh()
  } catch {
    showToast('更新失敗', true)
  } finally {
    saving.value = false
  }
}

const roleBadgeClass = (role: string) => ({
  'ADMIN':  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'EDITOR': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'STAFF':  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'MEMBER': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}[role] ?? 'bg-gray-100 text-gray-600')

onMounted(refresh)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-24 pb-12">

    <!-- 標題 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">帳號管理</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">管理所有 Google 登入成員的角色與狀態</p>
      </div>
      <button @click="refresh"
              :disabled="loading"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700
                     text-white text-sm font-medium transition-colors disabled:opacity-50">
        <i class="fa-solid fa-rotate-right" :class="{ 'animate-spin': loading }"></i>
        重新整理
      </button>
    </div>

    <!-- Toast -->
    <Transition enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-2"
                leave-active-class="transition ease-in duration-150"
                leave-to-class="opacity-0 translate-y-2">
      <div v-if="toast.show"
           :class="toast.error ? 'bg-red-500' : 'bg-green-500'"
           class="fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-5 py-2.5 rounded-xl
                  shadow-lg text-sm font-medium z-50">
        {{ toast.message }}
      </div>
    </Transition>

    <!-- 讀取中 -->
    <div v-if="loading" class="flex justify-center py-20">
      <svg class="w-10 h-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>

    <!-- 成員列表 -->
    <div v-else class="flex flex-col gap-3">
      <div v-for="c in customers" :key="c.id"
           :class="c.status === 'blocked' ? 'opacity-50' : ''"
           class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/50 rounded-2xl
                  border border-gray-200 dark:border-gray-700">

        <!-- 頭像 -->
        <div class="w-10 h-10 rounded-full overflow-hidden flex-none border border-gray-200 dark:border-gray-600">
          <img v-if="c.picture" :src="c.picture" :alt="c.name" class="w-full h-full object-cover">
          <span v-else
                class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
            {{ c.name?.charAt(0)?.toUpperCase() || '?' }}
          </span>
        </div>

        <!-- 資訊 -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-800 dark:text-white text-sm truncate">{{ c.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ c.email }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ c.createdAt }}</p>
        </div>

        <!-- Role 下拉 -->
        <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-none">
          <span :class="roleBadgeClass(c.role)"
                class="text-xs font-medium px-2 py-0.5 rounded-full hidden sm:inline">
            {{ c.role }}
          </span>
          <select :value="c.role"
                  @change="updateRole(c.id, ($event.target as HTMLSelectElement).value)"
                  :disabled="saving"
                  class="text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                         px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50">
            <option v-for="r in VALID_ROLES" :key="r" :value="r">{{ r }}</option>
          </select>

          <!-- 停用/啟用 -->
          <button @click="updateStatus(c.id, c.status === 'active' ? 'blocked' : 'active')"
                  :disabled="saving"
                  :class="c.status === 'blocked'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'"
                  class="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
            {{ c.status === 'blocked' ? '啟用' : '停用' }}
          </button>
        </div>
      </div>

      <p v-if="customers.length === 0"
         class="text-center text-gray-400 dark:text-gray-500 py-12">
        尚無登入紀錄
      </p>
    </div>
  </div>
</template>
