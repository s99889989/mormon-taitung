<script setup lang="ts">
import { apiFetch } from '~/utils/api.js'
import { useDarkModeStore } from '~/stores/dark_mode'

const dark_mode = useDarkModeStore()
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      showDropdown.value = false
    }
  })
})

const handleLogout = async () => {
  await apiFetch('mormon/auth/logout', { method: 'POST' })
  const auth = useCookie('admin_auth')
  auth.value = null
  await navigateTo('/login')
}
</script>

<template>
  <nav class="fixed w-full border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 z-40">
    <div class="flex flex-row items-center px-4 py-3 gap-4">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 flex-none">
        <img src="/assets/icon/hat.png" class="h-8" alt="Logo" />
        <span class="text-xl font-semibold whitespace-nowrap dark:text-white">台東一支會</span>
      </NuxtLink>

      <!-- 標題 -->
      <div class="flex-1">
        <span class="text-lg font-semibold text-gray-700 dark:text-gray-200">帳號管理</span>
      </div>

      <!-- 右側操作 -->
      <div class="flex items-center gap-2">

        <!-- 暗色切換 -->
        <button
            @click="dark_mode.change_dark_mode"
            class="text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap transition-colors
                   text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          {{ dark_mode.data.display_name }}
        </button>

        <!-- 返回幹部專區 -->
        <NuxtLink to="/staff/home"
                  class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                         text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          <i class="fa-solid fa-arrow-left text-xs"></i>
          幹部專區
        </NuxtLink>

        <!-- 頭像下拉 -->
        <div class="relative" ref="dropdownRef">
          <button
              @click.stop="showDropdown = !showDropdown"
              class="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center
                     text-white font-bold text-sm hover:bg-red-700 transition-colors">
            管
          </button>
          <div v-if="showDropdown"
               class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200
                      dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              管理員
            </div>
            <NuxtLink target="_blank" to="/" @click="showDropdown = false"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i class="fa-solid fa-house w-4"></i>
              查看前台
            </NuxtLink>
            <button @click="handleLogout"
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i class="fa-solid fa-right-from-bracket w-4"></i>
              登出
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>