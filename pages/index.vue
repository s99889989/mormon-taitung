<script setup lang="ts">
import { useActiveStore } from '~/stores/active'
definePageMeta({ layout: 'default' })

const activeStore = useActiveStore()
onMounted(async () => {
  await activeStore.refreshActive()
})

const quickLinks = [
  { to: '/front/activity/ActivityIndex', label: '活動', icon: '🎉', desc: '查看所有活動' },
  // { to: '/front/clean/CleanTime', label: '打掃', icon: '🧹', desc: '本週打掃時間表' },
  { to: '/front/english', label: '英文會話', icon: '🗣️', desc: '每週三晚上 7:00' },
  { to: '/front/link', label: '常用連結', icon: '🔗', desc: '教會相關網站' },
]
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <div class="relative w-full overflow-hidden" style="height: 420px;">
      <img
          src="/english/taidong.jpg"
          alt="台東一支會"
          class="w-full h-full object-cover"
      />
      <!-- 漸層遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>

      <!-- 文字 -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
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
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg mb-2">台東一支會</h1>
        <p class="text-lg md:text-xl text-white/80 drop-shadow">耶穌基督後期聖徒教會</p>
      </div>
    </div>

    <!-- 快速連結卡片 -->
    <div class="max-w-4xl mx-auto px-4 py-10">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-5">快速前往</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
            v-for="link in quickLinks" :key="link.to"
            :to="link.to"
            class="flex flex-col items-center gap-2 p-5 rounded-2xl border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
          <span class="text-3xl">{{ link.icon }}</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ link.label }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ link.desc }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 近期活動預覽 -->
    <div class="max-w-4xl mx-auto px-4 pb-12">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">近期活動</h2>
        <NuxtLink to="/front/activity/ActivityIndex"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          查看全部 →
        </NuxtLink>
      </div>

      <div v-if="activeStore.normalList.length === 0 && activeStore.fixedList.length === 0"
           class="text-center py-10 text-gray-400 dark:text-gray-500">
        目前沒有活動資料
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <NuxtLink
            v-for="active in [...activeStore.normalList].slice(0, 3)" :key="active.name"
            :to="`/front/activity/ActivityIndex`"
            class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                 rounded-2xl overflow-hidden hover:shadow-md transition-all">
          <div class="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img v-if="active.images && active.images.length > 0"
                 :src="active.images[0]"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 :alt="active.name" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600 text-4xl">
              🎉
            </div>
          </div>
          <div class="p-3">
            <p class="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{{ active.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ active.date }} {{ active.time }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>