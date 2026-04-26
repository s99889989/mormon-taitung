<script setup lang="ts">
const isDark = ref(true)
const mobileMenuOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => { mobileMenuOpen.value = false })

onMounted(() => {
  const saved = localStorage.getItem('ysa_dark')
  if (saved !== null) isDark.value = saved === '1'
  else isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('ysa_dark', isDark.value ? '1' : '0')
}

// 年份/活動 結構
const years = [
  {
    year: '2025',
    events: [
      { label: '第2回', days: ['第1天', '第2天', '第3天'], key: '2025-2' },
    ]
  },
  {
    year: '2024',
    events: [
      { label: '第2回', days: ['第1天', '第2天', '第3天'], key: '2024-2' },
      { label: '花蓮支聯會', days: ['第1天'], key: '2024-hualien', folder: 'hualien' },
    ]
  },
  {
    year: '2023',
    events: [
      { label: '第1回', days: ['第1天', '第2天', '第3天'], key: '2023-1' },
      { label: '第2回', days: ['第1天', '第2天', '第3天'], key: '2023-2' },
      { label: '第3回', days: ['第1天', '第2天', '第3天'], key: '2023-3' },
    ]
  },
  {
    year: '2022',
    events: [
      { label: '第3回', days: ['第1天', '第2天', '第3天'], key: '2022-3' },
      { label: '第4回', days: ['第1天', '第2天', '第3天'], key: '2022-4' },
    ]
  },
  {
    year: '2021',
    events: [
      { label: '第2回', days: ['第1天', '第2天', '第3天'], key: '2021-2' },
    ]
  },
]

const openDropdown = ref<string | null>(null)
const toggleDropdown = (key: string) => {
  openDropdown.value = openDropdown.value === key ? null : key
}

const buildPath = (year: string, eventKey: string, day: string, type: 'photo' | 'video') => {
  const folder = eventKey.includes('hualien') ? 'hualien' : eventKey.split('-')[1] ? `第${eventKey.split('-')[1]}回` : eventKey
  const pathArr = type === 'photo'
      ? ['ysa', 'image', year, folder, day]
      : ['ysa', 'video', year, folder, day]
  const title = `${year}-${folder}-${day}-${type === 'photo' ? '照片' : '影片'}`
  return `/photo/gallery?path=${encodeURIComponent(JSON.stringify(pathArr))}&title=${encodeURIComponent(title)}&type=${type}`
}

const buildHualienPath = (year: string, day: string, type: 'photo' | 'video') => {
  const pathArr = type === 'photo'
      ? ['ysa', 'image', year, 'hualien']
      : ['ysa', 'video', year, 'hualien', day]
  const title = `${year}-花蓮支聯會-${type === 'photo' ? '照片' : `${day}-影片`}`
  return `/photo/gallery?path=${encodeURIComponent(JSON.stringify(pathArr))}&title=${encodeURIComponent(title)}&type=${type}`
}
</script>

<template>
  <div :class="isDark ? 'dark bg-gray-900' : 'bg-white'" class="min-h-screen transition-colors">

    <!-- NavBar -->
    <nav :class="isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'"
         class="fixed w-full z-40 border-b transition-colors">
      <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <!-- Logo -->
        <NuxtLink to="/photo/home"
                  :class="isDark ? 'text-white' : 'text-gray-900'"
                  class="text-xl font-bold whitespace-nowrap flex-none">
          📸 單身成人大會
        </NuxtLink>

        <!-- 桌機：年份 dropdown -->
        <div class="hidden md:flex items-center gap-1 flex-1 justify-center flex-wrap">
          <div v-for="y in years" :key="y.year" class="relative">
            <button @click="toggleDropdown(y.year)"
                    :class="isDark ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
              {{ y.year }}
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="openDropdown === y.year"
                 :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
                 class="absolute top-full left-0 mt-1 border rounded-xl shadow-lg z-50 min-w-max">
              <div v-for="ev in y.events" :key="ev.key" class="p-2">
                <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs font-semibold px-2 mb-1">{{ ev.label }}</p>
                <div v-for="day in ev.days" :key="day" class="flex gap-1 px-2 py-0.5">
                  <span :class="isDark ? 'text-gray-300' : 'text-gray-600'" class="text-xs w-10">{{ day }}</span>
                  <NuxtLink v-if="ev.folder === 'hualien' && ev.label === '花蓮支聯會'"
                            :to="buildHualienPath(y.year, day, 'photo')"
                            @click="openDropdown = null"
                            class="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors">
                    照片
                  </NuxtLink>
                  <NuxtLink v-else
                            :to="buildPath(y.year, ev.key, day, 'photo')"
                            @click="openDropdown = null"
                            class="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 transition-colors">
                    照片
                  </NuxtLink>
                  <NuxtLink v-if="ev.folder === 'hualien' && ev.label === '花蓮支聯會'"
                            :to="buildHualienPath(y.year, day, 'video')"
                            @click="openDropdown = null"
                            class="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 transition-colors">
                    影片
                  </NuxtLink>
                  <NuxtLink v-else
                            :to="buildPath(y.year, ev.key, day, 'video')"
                            @click="openDropdown = null"
                            class="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 transition-colors">
                    影片
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：暗色 + 漢堡 -->
        <div class="flex items-center gap-2 flex-none">
          <button @click="toggleDark"
                  :class="isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'"
                  class="p-2 rounded-lg transition-colors">
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>
          <button @click="mobileMenuOpen = !mobileMenuOpen"
                  :class="isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'"
                  class="md:hidden p-2 rounded-lg transition-colors">
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
           class="md:hidden border-t max-h-96 overflow-y-auto">
        <div v-for="y in years" :key="y.year" class="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <p :class="isDark ? 'text-white' : 'text-gray-900'" class="font-bold text-sm mb-2">{{ y.year }}</p>
          <div v-for="ev in y.events" :key="ev.key" class="mb-2">
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs mb-1">{{ ev.label }}</p>
            <div v-for="day in ev.days" :key="day" class="flex gap-2 items-center mb-1">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-xs w-10">{{ day }}</span>
              <NuxtLink v-if="ev.folder === 'hualien'"
                        :to="buildHualienPath(y.year, day, 'photo')"
                        @click="mobileMenuOpen = false"
                        class="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">照片</NuxtLink>
              <NuxtLink v-else
                        :to="buildPath(y.year, ev.key, day, 'photo')"
                        @click="mobileMenuOpen = false"
                        class="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">照片</NuxtLink>
              <NuxtLink v-if="ev.folder === 'hualien'"
                        :to="buildHualienPath(y.year, day, 'video')"
                        @click="mobileMenuOpen = false"
                        class="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">影片</NuxtLink>
              <NuxtLink v-else
                        :to="buildPath(y.year, ev.key, day, 'video')"
                        @click="mobileMenuOpen = false"
                        class="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">影片</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 頁面內容 -->
    <div class="pt-16">
      <slot />
    </div>
  </div>
</template>