<script setup lang="ts">
import { apiFetch } from '~/utils/api.js'
import { useDarkModeStore } from '~/stores/dark_mode'

const dark_mode = useDarkModeStore()
const route = useRoute()
const mobileMenuOpen = ref(false)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const isActive = (path: string) => route.path.startsWith(path)

// 路由切換時關閉選單
watch(() => route.path, () => {
  mobileMenuOpen.value = false
  showDropdown.value = false
})

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

const navItems = [
  { to: '/admin/activity/list', label: '活動' },
  { to: '/admin/roll_call/list', label: '點名' },
  { to: '/admin/member/list', label: '成員' },
  { to: '/admin/family/list', label: '家庭' },
  { to: '/admin/photo/list', label: '照片' },
  { to: '/admin/link/list', label: '連結' },
]
</script>

<template>
  <nav class="fixed w-full border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 z-40">
    <div class="flex flex-row items-center px-4 py-3 gap-4">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 flex-none">
        <img src="/assets/icon/hat.png" class="h-8" alt="Logo" />
        <span class="text-xl font-semibold whitespace-nowrap dark:text-white">台東一支會</span>
      </NuxtLink>

      <!-- 桌機導覽 -->
      <ul class="hidden md:flex items-center gap-1 flex-1 justify-center">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
              :to="item.to"
              :class="isActive(item.to)
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
              : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              class="text-xl font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors block">
            {{ item.label }}
          </NuxtLink>
        </li>
        <li>
          <button
              @click="dark_mode.change_dark_mode"
              class="text-xl font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                     text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400
                     hover:bg-gray-100 dark:hover:bg-gray-700">
            {{ dark_mode.data.display_name }}
          </button>
        </li>
      </ul>

      <!-- 桌機頭像下拉 -->
      <div class="hidden md:block relative flex-none" ref="dropdownRef">
        <button
            @click.stop="showDropdown = !showDropdown"
            class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
                   text-white font-bold text-sm hover:bg-blue-700 transition-colors">
          管
        </button>
        <div v-if="showDropdown"
             class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200
                    dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
          <div class="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            管理員
          </div>
          <NuxtLink target="_blank" to="/" @click="showDropdown = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-house w-4"></i>
            查看前台
          </NuxtLink>
          <NuxtLink target="_blank" to="/photo/home" @click="showDropdown = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-image w-4"></i>
            查看照片
          </NuxtLink>
          <NuxtLink to="/admin/setting/main" @click="showDropdown = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-gear w-4"></i>
            設定
          </NuxtLink>
          <button @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-right-from-bracket w-4"></i>
            登出
          </button>
        </div>
      </div>

      <!-- 手機右側：漢堡 -->
      <div class="flex items-center gap-2 md:hidden ml-auto">
        <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 手機展開選單 -->
    <div v-if="mobileMenuOpen"
         class="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 pb-4">
      <ul class="flex flex-col gap-1 pt-3">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
              :to="item.to"
              :class="isActive(item.to)
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'"
              class="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex flex-col gap-1">
        <button
            @click="dark_mode.change_dark_mode"
            class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
          {{ dark_mode.data.display_name }}
        </button>
        <NuxtLink target="_blank" to="/"
                  class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          查看前台
        </NuxtLink>
        <NuxtLink to="/admin/setting/main"
                  class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          設定
        </NuxtLink>
        <button @click="handleLogout"
                class="flex items-center px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
          登出
        </button>
      </div>
    </div>
  </nav>
</template>