<script setup lang="ts">
import { useActiveStore } from '~/stores/active'
definePageMeta({ layout: 'default' })

const activeStore = useActiveStore()
const loading = ref(true)

onMounted(async () => {
  await activeStore.refreshActive()
  loading.value = false
})

const latestActivities = computed(() =>
    activeStore.normalList.slice(0, 3)
)

function stripHtml(html: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const quickLinks = [
  { to: '/front/activity/ActivityIndex', label: '活動', icon: '🎉', desc: '查看所有活動' },
  { to: '/front/meeting', label: '聚會資訊', icon: '⛪', desc: '聚會時間與地點' },
  // { to: '/front/english', label: '英文會話', icon: '🗣️', desc: '每週三晚上 7:00' },
  { to: '/front/about', label: '認識我們', icon: '👥', desc: '關於台東一支會' },
]
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative w-full overflow-hidden" style="height: 460px;">
      <img src="/english/taidong.jpg" alt="台東一支會" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <svg class="h-14 w-14 mb-4 drop-shadow-lg" viewBox="-160 -160 320 320" xmlns="http://www.w3.org/2000/svg">
          <defs><clipPath id="hex-hero"><polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80"/></clipPath></defs>
          <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="#0A2744"/>
          <rect x="-139" y="-160" width="278" height="182" fill="#1255A0" clip-path="url(#hex-hero)"/>
          <circle cx="0" cy="-22" r="36" fill="#FFB830" clip-path="url(#hex-hero)"/>
          <circle cx="0" cy="-22" r="24" fill="#FFEC6E" clip-path="url(#hex-hero)"/>
          <circle cx="0" cy="-22" r="14" fill="#FFFDE0" clip-path="url(#hex-hero)"/>
          <polygon points="-139,28 -100,-30 -68,10 -32,-52 0,-10 32,-44 68,8 100,-20 139,28 139,160 -139,160" fill="#1B4D1B" clip-path="url(#hex-hero)"/>
          <path d="M-139,62 Q-104,46 -70,62 Q-35,78 0,62 Q35,46 70,62 Q104,78 139,62 L139,160 L-139,160 Z" fill="#1255A0" clip-path="url(#hex-hero)"/>
          <path d="M-139,100 Q-104,86 -70,100 Q-35,114 0,100 Q35,86 70,100 Q104,114 139,100 L139,160 L-139,160 Z" fill="#072560" clip-path="url(#hex-hero)"/>
          <rect x="-10" y="-60" width="20" height="66" fill="#FFFFFF" rx="4"/>
          <rect x="-36" y="-38" width="72" height="20" fill="#FFFFFF" rx="4"/>
          <polygon points="0,128 14,114 0,100 -14,114" fill="#FFD700" clip-path="url(#hex-hero)"/>
          <polygon points="0,-160 139,-80 139,80 0,160 -139,80 -139,-80" fill="none" stroke="#FFB830" stroke-width="5"/>
        </svg>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg mb-2">台東第一支會</h1>
        <p class="text-lg md:text-xl text-white/80 drop-shadow mb-6">耶穌基督後期聖徒教會</p>
        <NuxtLink to="/front/meeting"
                  class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors shadow-lg">
          了解聚會時間 →
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4">

      <!-- 快速連結 -->
      <div class="py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink v-for="item in quickLinks" :key="item.to" :to="item.to"
                    class="group flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500
                           hover:shadow-md transition-all duration-200 text-center">
            <span class="text-3xl">{{ item.icon }}</span>
            <p class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ item.label }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500">{{ item.desc }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- 聚會資訊 Banner -->
      <div class="mb-10 rounded-2xl bg-blue-600 dark:bg-blue-700 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-white text-center sm:text-left">
          <p class="text-lg font-bold mb-1">每週日聚會</p>
          <p class="text-blue-100 text-sm">上午 10:00 · 台東市正氣北路 206 號</p>
        </div>
        <NuxtLink to="/front/meeting"
                  class="flex-none px-5 py-2 bg-white text-blue-600 font-semibold rounded-xl text-sm hover:bg-blue-50 transition-colors">
          查看詳情
        </NuxtLink>
      </div>

      <!-- 最新活動 -->
      <div class="pb-12">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">最新活動</h2>
          <NuxtLink to="/front/activity/ActivityIndex"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            查看全部 →
          </NuxtLink>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
          <div class="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="latestActivities.length === 0"
             class="text-center py-10 text-gray-400 dark:text-gray-500">
          目前沒有活動
        </div>

        <div v-else class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
          <NuxtLink v-for="active in latestActivities" :key="`${active.date}-${active.time}`"
                    :to="`/front/activity/detail?date=${active.date}&time=${active.time}`"
                    class="group bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700
                           hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
            <div class="w-full aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden flex-none">
              <img v-if="active.images && active.images.length > 0"
                   :src="active.images[0]" :alt="active.name"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl">🎉</div>
            </div>
            <div class="p-4 flex flex-col flex-1">
              <p class="text-xs text-gray-400 dark:text-gray-500 mb-1">{{ active.date }}</p>
              <p class="font-bold text-base text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ active.name }}
              </p>
              <p v-if="active.info" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                {{ stripHtml(active.info) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>