<script setup lang="ts">
import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '~/utils/api'

const props = defineProps<{ isDark: boolean }>()
const emit = defineEmits(['toggle-dark'])

const route = useRoute()
const mobileMenuOpen = ref(false)
const isActive = (path: string) => route.path.startsWith(path)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
  avatarOpen.value = false
})

watch(() => props.isDark, (val) => {
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', val)
  }
})

onMounted(() => {
  if (props.isDark) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

const navItems = [
  { to: '/front/activity/ActivityIndex', label: '活動' },
  { to: '/front/calendar', label: '行事曆' },
  { to: '/front/meeting', label: '聚會' },
  { to: '/front/about', label: '認識我們' },
  { to: '/front/history', label: '支會歷史' },
  { to: '/front/link', label: '連結' },
]

// ── Google 登入 ────────────────────────────────────────────────────────────
const API_BASE = API_BASE_URL

const customerStore = useCustomerStore()
const customer = computed(() => customerStore.data.customer)

const avatarOpen = ref(false)
const avatarRef = ref<HTMLElement | null>(null)

const toggleAvatar = () => {
  avatarOpen.value = !avatarOpen.value
  if (avatarOpen.value && !customer.value) {
    nextTick(() => {
      renderGoogleBtn('nav-google-btn')
      renderGoogleBtn('nav-google-btn-mobile')
    })
  }
}
const closeAvatar = () => { avatarOpen.value = false }

// 點外部關閉
const onClickOutside = (e: MouseEvent) => {
  if (avatarRef.value && !avatarRef.value.contains(e.target as Node)) {
    avatarOpen.value = false
  }
}

const initGoogle = () => {
  if (!window.google) return
      ;(window.google as any).accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredential,
    auto_select: false,
  })
}

const renderGoogleBtn = (elId: string) => {
  if (!window.google) return
  const el = document.getElementById(elId)
  if (!el) return
      ;(window.google as any).accounts.id.renderButton(el, {
    theme: 'outline', size: 'medium', text: 'signin_with', locale: 'zh-TW', width: 220,
  })
}

const handleCredential = async (response: any) => {
  try {
    const res = await fetch(`${API_BASE}mormon/customer/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential: response.credential }),
    })
    const data = await res.json()
    if (!data.error) {
      customerStore.setCustomer(data)
      avatarOpen.value = false
    }
  } catch { /* 靜默處理 */ }
}

const logout = async () => {
  await fetch(`${API_BASE}mormon/customer/logout`, { method: 'POST', credentials: 'include' })
  customerStore.clearCustomer()
  avatarOpen.value = false
}

const fetchMe = async () => {
  try {
    const res = await fetch(`${API_BASE}mormon/customer/me`, { credentials: 'include' })
    const data = await res.json()
    if (!data.error) customerStore.setCustomer(data)
  } catch { /* 靜默 */ }
}

onMounted(async () => {
  await fetchMe()
  document.addEventListener('click', onClickOutside)

  if (!document.getElementById('google-gsi-script')) {
    const script = document.createElement('script')
    script.id = 'google-gsi-script'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => initGoogle()
    document.head.appendChild(script)
  } else if ((window as any).google) {
    initGoogle()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <nav :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
       class="fixed w-full z-40 border-b transition-colors">
    <div class="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-3">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 flex-none">
        <svg class="h-8 w-8 flex-none" viewBox="-160 -160 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="hex-nav">
              <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80"/>
            </clipPath>
          </defs>
          <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="#0A2744"/>
          <rect x="-139" y="-160" width="278" height="182" fill="#1255A0" clip-path="url(#hex-nav)"/>
          <circle cx="0" cy="-22" r="36" fill="#FFB830" clip-path="url(#hex-nav)"/>
          <circle cx="0" cy="-22" r="24" fill="#FFEC6E" clip-path="url(#hex-nav)"/>
          <circle cx="0" cy="-22" r="14" fill="#FFFDE0" clip-path="url(#hex-nav)"/>
          <polygon points="-139,28 -100,-30 -68,10 -32,-52 0,-10 32,-44 68,8 100,-20 139,28 139,160 -139,160" fill="#1B4D1B" clip-path="url(#hex-nav)"/>
          <path d="M-139,62 Q-104,46 -70,62 Q-35,78 0,62 Q35,46 70,62 Q104,78 139,62 L139,160 L-139,160 Z" fill="#1255A0" clip-path="url(#hex-nav)"/>
          <path d="M-139,100 Q-104,86 -70,100 Q-35,114 0,100 Q35,86 70,100 Q104,114 139,100 L139,160 L-139,160 Z" fill="#072560" clip-path="url(#hex-nav)"/>
          <rect x="-10" y="-60" width="20" height="66" fill="#FFFFFF" rx="4"/>
          <rect x="-36" y="-38" width="72" height="20" fill="#FFFFFF" rx="4"/>
          <polygon points="0,128 14,114 0,100 -14,114" fill="#FFD700" clip-path="url(#hex-nav)"/>
          <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="none" stroke="#FFB830" stroke-width="5"/>
        </svg>
        <span :class="isDark ? 'text-white' : 'text-gray-900'"
              class="text-2xl font-bold whitespace-nowrap">台東一支會</span>
      </NuxtLink>

      <!-- 桌機導覽 + 頭像 -->
      <div class="hidden md:flex items-center gap-1">
        <ul class="flex items-center gap-1">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
                :to="item.to"
                :class="[
                isActive(item.to)
                  ? (isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50')
                  : (isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              ]"
                class="block px-3 py-2 rounded-lg text-lg font-medium transition-colors">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>

        <!-- 暗色切換 -->
        <button
            @click="emit('toggle-dark')"
            :class="isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'"
            class="p-2 rounded-lg transition-colors">
          <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>

        <!-- 桌機頭像按鈕 -->
        <div class="relative" ref="avatarRef">
          <!-- 未登入 -->
          <button v-if="!customer" @click.stop="toggleAvatar"
                  :class="isDark ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400' : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500'"
                  class="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors bg-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </button>
          <!-- 已登入 -->
          <button v-else @click.stop="toggleAvatar"
                  class="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500 hover:opacity-80 transition-opacity p-0">
            <img v-if="customer.picture" :src="customer.picture" :alt="customer.name"
                 class="w-full h-full object-cover">
            <span v-else
                  class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
              {{ customer.name?.charAt(0)?.toUpperCase() || '?' }}
            </span>
          </button>

          <!-- 桌機下拉選單 -->
          <Transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-1">
            <div v-if="avatarOpen"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
                 class="absolute right-0 top-11 w-64 rounded-2xl shadow-xl border overflow-hidden z-50">

              <!-- 未登入 -->
              <div v-if="!customer" class="p-4">
                <p :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                   class="text-sm mb-3">登入後可使用更多功能</p>
                <div id="nav-google-btn"></div>
              </div>

              <!-- 已登入 -->
              <template v-else>
                <div :class="isDark ? 'border-gray-700' : 'border-gray-100'"
                     class="flex items-center gap-3 px-4 py-3 border-b">
                  <div class="w-9 h-9 rounded-full overflow-hidden flex-none">
                    <img v-if="customer.picture" :src="customer.picture" :alt="customer.name"
                         class="w-full h-full object-cover">
                    <span v-else
                          class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">
                      {{ customer.name?.charAt(0)?.toUpperCase() }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <p :class="isDark ? 'text-white' : 'text-gray-900'"
                       class="font-semibold text-sm truncate">{{ customer.name }}</p>
                    <p :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                       class="text-xs truncate">{{ customer.email }}</p>
                  </div>
                </div>
                <ul class="py-1">
                  <li v-if="customer.role === 'ADMIN' || customer.role === 'STAFF' || customer.role === 'EDITOR'">
                    <NuxtLink to="/staff/home" @click="closeAvatar"
                              :class="isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'"
                              class="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"/>
                      </svg>
                      管理後台
                    </NuxtLink>
                  </li>
                  <li :class="isDark ? 'border-gray-700' : 'border-gray-100'" class="border-t mt-1 pt-1">
                    <button @click="logout"
                            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      登出
                    </button>
                  </li>
                </ul>
              </template>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 手機右側：暗色 + 頭像 + 漢堡 -->
      <div class="flex items-center gap-1 md:hidden">
        <!-- 暗色切換 -->
        <button
            @click="emit('toggle-dark')"
            :class="isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'"
            class="p-2 rounded-lg transition-colors">
          <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>

        <!-- 手機頭像按鈕（未登入） -->
        <button v-if="!customer" @click.stop="toggleAvatar"
                :class="isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-transparent transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </button>
        <!-- 手機頭像按鈕（已登入） -->
        <button v-else @click.stop="toggleAvatar"
                class="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 hover:opacity-80 transition-opacity p-0">
          <img v-if="customer.picture" :src="customer.picture" :alt="customer.name"
               class="w-full h-full object-cover">
          <span v-else
                class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
            {{ customer.name?.charAt(0)?.toUpperCase() || '?' }}
          </span>
        </button>

        <!-- 漢堡選單 -->
        <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'"
            class="p-2 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 手機導覽選單（漢堡展開） -->
    <div v-if="mobileMenuOpen"
         :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
         class="md:hidden border-t px-4 pb-3">
      <ul class="flex flex-col gap-1 pt-2">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
              :to="item.to"
              :class="[
              isActive(item.to)
                ? (isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50')
                : (isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
            ]"
              class="block px-4 py-2.5 rounded-lg text-lg font-medium transition-colors">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- 手機頭像下拉（headless，浮動在 nav 外） -->
    <Transition
        enter-active-class="transition ease-out duration-150"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1">
      <div v-if="avatarOpen && !mobileMenuOpen"
           :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
           class="md:hidden fixed right-3 top-14 w-60 rounded-2xl shadow-xl border overflow-hidden z-50">

        <!-- 未登入 -->
        <div v-if="!customer" class="p-4">
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'"
             class="text-sm mb-3">登入後可使用更多功能</p>
          <div id="nav-google-btn-mobile"></div>
        </div>

        <!-- 已登入 -->
        <template v-else>
          <div :class="isDark ? 'border-gray-700' : 'border-gray-100'"
               class="flex items-center gap-3 px-4 py-3 border-b">
            <div class="w-8 h-8 rounded-full overflow-hidden flex-none">
              <img v-if="customer.picture" :src="customer.picture" :alt="customer.name"
                   class="w-full h-full object-cover">
              <span v-else
                    class="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                {{ customer.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0">
              <p :class="isDark ? 'text-white' : 'text-gray-900'"
                 class="font-semibold text-sm truncate">{{ customer.name }}</p>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                 class="text-xs truncate">{{ customer.email }}</p>
            </div>
          </div>
          <ul class="py-1">
            <li v-if="customer.role === 'ADMIN' || customer.role === 'STAFF' || customer.role === 'EDITOR'">
              <NuxtLink to="/staff/home" @click="closeAvatar"
                        :class="isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'"
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"/>
                </svg>
                管理後台
              </NuxtLink>
            </li>
            <li :class="isDark ? 'border-gray-700' : 'border-gray-100'" class="border-t mt-1 pt-1">
              <button @click="logout"
                      class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                登出
              </button>
            </li>
          </ul>
        </template>
      </div>
    </Transition>
  </nav>
</template>