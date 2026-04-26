<script setup lang="ts">
import { apiFetch } from '~/utils/api.js'
import { useDarkModeStore } from '~/stores/dark_mode'
import { initFlowbite } from 'flowbite'

const dark_mode = useDarkModeStore()
const route = useRoute()

onMounted(() => {
  initFlowbite()
})

const isActive = (path: string) => route.path.startsWith(path)

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
    <div class="flex flex-row items-center px-4 py-3 gap-6">

      <NuxtLink to="/" class="flex items-center gap-2 flex-none">
        <img src="/assets/icon/hat.png" class="h-8" alt="Logo" />
        <span class="text-xl font-semibold whitespace-nowrap dark:text-white">台東一支會</span>
      </NuxtLink>

      <ul class="flex items-center gap-1 flex-1 justify-center">
        <li v-for="item in [
          { to: '/admin/activity/list', label: '活動' },
          { to: '/admin/roll_call/list', label: '點名' },
          { to: '/admin/member/list', label: '成員' },
          { to: '/admin/family/list', label: '家庭' },
        ]" :key="item.to">
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

      <!-- 頭像下拉選單 -->
      <div class="relative flex-none" ref="dropdownRef">
        <button
            @click.stop="showDropdown = !showDropdown"
            class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
                 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
          管
        </button>

        <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200
                 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">

          <div class="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 border-b
                      border-gray-100 dark:border-gray-700">
            管理員
          </div>

          <NuxtLink target="_blank"
              to="/"
              @click="showDropdown = false"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-house w-4"></i>
            查看前台
          </NuxtLink>

          <NuxtLink
              to="/admin/setting/main"
              @click="showDropdown = false"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-key w-4"></i>
            修改密碼
          </NuxtLink>

          <button
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-arrow-right-from-bracket w-4"></i>
            登出
          </button>
        </div>
      </div>

    </div>
  </nav>
</template>