<script setup lang="ts">
definePageMeta({ layout: 'default' })

const meetings = [
  {
    name: '主日學',
    time: '每週日 上午 10:15 – 11:15',
    desc: '依年齡分班研讀聖經及其他經文，加深對福音的理解。',
    icon: '📖',
    open: true,
  },
  {
    name: '聖餐聚會',
    time: '每週日 上午 11:15 – 12:15',
    desc: '全體成員一起領受聖餐、聆聽講道、分享見證，是每週最重要的聚會。所有人都歡迎參加。',
    icon: '🍞',
    open: true,
  },
  // {
  //   name: '英文會話小組',
  //   time: '每週三 晚上 7:00 – 8:30',
  //   desc: '免費英文會話課程，歡迎社區所有人參加，不需要是教會成員。目前為混合程度班。',
  //   icon: '🗣️',
  //   open: true,
  // },
]
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">

    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">聚會資訊</h1>
    <div class="w-12 h-1 bg-blue-600 rounded mb-8"></div>

    <!-- 地點卡片 -->
    <div class="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="bg-blue-600 dark:bg-blue-700 px-6 py-5 text-white">
        <h2 class="text-lg font-bold mb-1">聚會地點</h2>
        <p class="text-blue-100 text-sm">台東市正氣北路 206 號</p>
      </div>
      <div class="px-6 py-4 bg-white dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4">
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span class="text-xl">📞</span>
          <span class="text-sm">089-325240</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span class="text-xl">🚌</span>
          <span class="text-sm">位於台東市區，交通方便</span>
        </div>
      </div>
    </div>

    <!-- 聚會列表 -->
    <section class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        聚會時間表
      </h2>
      <div class="flex flex-col gap-3">
        <div v-for="m in meetings" :key="m.name"
             class="flex gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <span class="text-3xl flex-none">{{ m.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h3 class="font-bold text-gray-900 dark:text-white">{{ m.name }}</h3>
              <span v-if="m.open"
                    class="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                歡迎訪客
              </span>
            </div>
            <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{{ m.time }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 初次拜訪 -->
    <section class="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-6 py-6">
      <h2 class="text-lg font-bold text-blue-900 dark:text-blue-200 mb-3">第一次來訪？</h2>
      <p class="text-sm text-blue-800 dark:text-blue-300 leading-relaxed mb-4">
        歡迎您！不需要預約，直接在聚會時間前來即可。穿著整齊即可，沒有特殊要求。我們會有人在門口迎接您。
      </p>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/front/about"
                  class="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          了解更多
        </NuxtLink>
        <a href="https://www.churchofjesuschrist.org/?lang=zho" target="_blank"
           class="px-4 py-2 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          教會官網
        </a>
      </div>
    </section>

  </div>
</template>
