<script setup lang="ts">
import { useDarkModeStore } from '~/stores/dark_mode'
import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL } from '~/utils/api'

const dark_mode = useDarkModeStore()
const customerStore = useCustomerStore()
const customer = computed(() => customerStore.data.customer)

const route = useRoute()
const mobileMenuOpen = ref(false)

// 桌機頭像下拉
const desktopDropdownOpen = ref(false)
const desktopDropdownRef = ref<HTMLElement | null>(null)

// 手機頭像下拉
const mobileAvatarOpen = ref(false)

const isActive = (path: string) => route.path.startsWith(path)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
  desktopDropdownOpen.value = false
  mobileAvatarOpen.value = false
})

const onClickOutside = (e: MouseEvent) => {
  if (desktopDropdownRef.value && !desktopDropdownRef.value.contains(e.target as Node)) {
    desktopDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})

const handleLogout = async () => {
  await fetch(`${API_BASE_URL}mormon/customer/logout`, { method: 'POST', credentials: 'include' })
  customerStore.clearCustomer()
  await navigateTo('/')
}

const navItems = [
  { to: '/staff/home', label: '首頁' },
  { to: '/staff/activity/list', label: '活動' },
  { to: '/staff/roll_call/list', label: '點名' },
  { to: '/staff/member/list', label: '成員' },
  { to: '/staff/family/list', label: '家庭' },
  { to: '/staff/photo/list', label: '照片' },
  { to: '/staff/html/list', label: '網站' },
  { to: '/staff/link/list', label: '連結' },
]
</script>

<template>
  <nav class="fixed w-full border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 z-40">
    <div class="flex flex-row items-center px-4 py-3 gap-4">

      <!-- Logo -->
      <NuxtLink to="/staff/home" class="flex items-center gap-2 flex-none">
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
      <div class="hidden md:block relative flex-none" ref="desktopDropdownRef">
        <button
            @click.stop="desktopDropdownOpen = !desktopDropdownOpen"
            class="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500
                   flex items-center justify-center hover:opacity-80 transition-opacity">
          <img v-if="customer?.picture" :src="customer.picture" :alt="customer?.name"
               class="w-full h-full object-cover">
          <span v-else
                class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
            {{ customer?.name?.charAt(0)?.toUpperCase() || '幹' }}
          </span>
        </button>

        <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1">
          <div v-if="desktopDropdownOpen"
               class="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200
                      dark:border-gray-700 rounded-2xl shadow-xl py-1 z-50 overflow-hidden">
            <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div class="w-8 h-8 rounded-full overflow-hidden flex-none">
                <img v-if="customer?.picture" :src="customer.picture" :alt="customer?.name"
                     class="w-full h-full object-cover">
                <span v-else
                      class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                  {{ customer?.name?.charAt(0)?.toUpperCase() || '幹' }}
                </span>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ customer?.name || '幹部' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ customer?.role }}</p>
              </div>
            </div>
            <NuxtLink target="_blank" to="/" @click="desktopDropdownOpen = false"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i class="fa-solid fa-house w-4"></i>查看前台
            </NuxtLink>
            <NuxtLink target="_blank" to="/photo/home" @click="desktopDropdownOpen = false"
                      class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i class="fa-solid fa-image w-4"></i>查看照片
            </NuxtLink>

            <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
              <button @click="handleLogout"
                      class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400
                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <i class="fa-solid fa-right-from-bracket w-4"></i>登出
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 手機右側：頭像 + 漢堡 -->
      <div class="flex items-center gap-2 md:hidden ml-auto">

        <!-- 手機頭像按鈕 -->
        <button @click.stop="mobileAvatarOpen = !mobileAvatarOpen; mobileMenuOpen = false"
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500
                       flex items-center justify-center hover:opacity-80 transition-opacity flex-none">
          <img v-if="customer?.picture" :src="customer.picture" :alt="customer?.name"
               class="w-full h-full object-cover">
          <span v-else
                class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
            {{ customer?.name?.charAt(0)?.toUpperCase() || '幹' }}
          </span>
        </button>

        <!-- 漢堡按鈕 -->
        <button @click="mobileMenuOpen = !mobileMenuOpen; mobileAvatarOpen = false"
                class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 手機：頁面導覽（漢堡展開） -->
    <div v-show="mobileMenuOpen"
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
        <li>
          <button
              @click="dark_mode.change_dark_mode"
              class="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-colors
                     text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            {{ dark_mode.data.display_name }}
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <!-- 手機：頭像下拉（浮動，nav 外） -->
  <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1">
    <div v-if="mobileAvatarOpen"
         class="md:hidden fixed right-3 top-14 w-60 bg-white dark:bg-gray-800 border border-gray-200
                dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50">
      <!-- 使用者資訊 -->
      <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div class="w-9 h-9 rounded-full overflow-hidden flex-none border-2 border-blue-500">
          <img v-if="customer?.picture" :src="customer.picture" :alt="customer?.name"
               class="w-full h-full object-cover">
          <span v-else
                class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
            {{ customer?.name?.charAt(0)?.toUpperCase() || '幹' }}
          </span>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ customer?.name || '幹部' }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ customer?.role }}</p>
        </div>
      </div>
      <ul class="py-1">
        <li>
          <NuxtLink target="_blank" to="/" @click="mobileAvatarOpen = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-house w-4"></i>查看前台
          </NuxtLink>
        </li>
        <li>
          <NuxtLink target="_blank" to="/photo/home" @click="mobileAvatarOpen = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-image w-4"></i>查看照片
          </NuxtLink>
        </li>

        <li class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
          <button @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="fa-solid fa-right-from-bracket w-4"></i>登出
          </button>
        </li>
      </ul>
    </div>
  </Transition>
</template>