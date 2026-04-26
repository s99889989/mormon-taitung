<template>
  <div :class="isDark ? 'dark bg-gray-900' : 'bg-white'" class="min-h-screen transition-colors flex flex-col">
    <FrontNavBar @toggle-dark="toggleDark" :is-dark="isDark" />
    <div class="pt-16 pb-10 flex-1">
      <slot />
    </div>

    <!-- 頁底 -->
    <footer :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'"
            class="border-t transition-colors">
      <div class="max-w-5xl mx-auto px-4 py-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">

          <!-- 左側：Logo + 版權 -->
          <div class="flex flex-col items-center sm:items-start gap-2">
            <div class="flex items-center gap-2">
              <svg class="h-7 w-7 flex-none" viewBox="-160 -160 320 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="hex-footer">
                    <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80"/>
                  </clipPath>
                </defs>
                <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="#0A2744"/>
                <rect x="-139" y="-160" width="278" height="182" fill="#1255A0" clip-path="url(#hex-footer)"/>
                <circle cx="0" cy="-22" r="36" fill="#FFB830" clip-path="url(#hex-footer)"/>
                <circle cx="0" cy="-22" r="24" fill="#FFEC6E" clip-path="url(#hex-footer)"/>
                <circle cx="0" cy="-22" r="14" fill="#FFFDE0" clip-path="url(#hex-footer)"/>
                <polygon points="-139,28 -100,-30 -68,10 -32,-52 0,-10 32,-44 68,8 100,-20 139,28 139,160 -139,160" fill="#1B4D1B" clip-path="url(#hex-footer)"/>
                <path d="M-139,62 Q-104,46 -70,62 Q-35,78 0,62 Q35,46 70,62 Q104,78 139,62 L139,160 L-139,160 Z" fill="#1255A0" clip-path="url(#hex-footer)"/>
                <path d="M-139,100 Q-104,86 -70,100 Q-35,114 0,100 Q35,86 70,100 Q104,114 139,100 L139,160 L-139,160 Z" fill="#072560" clip-path="url(#hex-footer)"/>
                <rect x="-10" y="-60" width="20" height="66" fill="#FFFFFF" rx="4"/>
                <rect x="-36" y="-38" width="72" height="20" fill="#FFFFFF" rx="4"/>
                <polygon points="0,128 14,114 0,100 -14,114" fill="#FFD700" clip-path="url(#hex-footer)"/>
                <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="none" stroke="#FFB830" stroke-width="5"/>
              </svg>
              <span :class="isDark ? 'text-white' : 'text-gray-900'"
                    class="text-lg font-bold">台東第一支會</span>
            </div>
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs text-center sm:text-left">
              耶穌基督後期聖徒教會
            </p>
            <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-xs text-center sm:text-left">
              © {{ new Date().getFullYear() }} 台東第一支會．All Rights Reserved
            </p>
          </div>

          <!-- 右側：Facebook 連結 -->
          <a href="https://www.facebook.com/groups/Taitung1branch/" target="_blank" rel="noopener noreferrer"
             :class="isDark
               ? 'bg-gray-700 border-gray-600 hover:border-blue-500 hover:bg-gray-600'
               : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md'"
             class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 group">
            <!-- FB icon -->
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-none">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <p :class="isDark ? 'text-white' : 'text-gray-900'"
                 class="text-sm font-semibold group-hover:text-blue-500 transition-colors">台東第一支會</p>
              <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs">追蹤我們的粉絲頁</p>
            </div>
            <svg class="w-4 h-4 ml-1 flex-none"
                 :class="isDark ? 'text-gray-500' : 'text-gray-300'"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'front_dark_mode'

const isDark = ref(true)

const toggleDark = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, isDark.value ? '1' : '0')
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isDark.value = saved === '1'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>