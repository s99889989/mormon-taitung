<script setup lang="ts">
const props = defineProps<{ isDark: boolean }>()
const emit = defineEmits(['toggle-dark'])

const route = useRoute()
const mobileMenuOpen = ref(false)
const isActive = (path: string) => route.path.startsWith(path)

watch(() => route.path, () => { mobileMenuOpen.value = false })

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
  // { to: '/front/clean/CleanTime', label: '打掃' },
  { to: '/front/english', label: '英文會話' },
  { to: '/front/link', label: '連結' },
  { to: '/front/history', label: '支會歷史' }
]
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

      <!-- 桌機導覽 -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
              :to="item.to"
              :class="[
              isActive(item.to)
                ? (isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50')
                : (isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
            ]"
              class="block px-4 py-2 rounded-lg text-xl font-medium transition-colors">
            {{ item.label }}
          </NuxtLink>
        </li>

        <!-- 暗色切換 -->
        <li>
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
        </li>
      </ul>

      <!-- 手機右側：暗色 + 漢堡 -->
      <div class="flex items-center gap-2 md:hidden">
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

    <!-- 手機選單 -->
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
  </nav>
</template>