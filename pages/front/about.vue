<script setup lang="ts">
definePageMeta({ layout: 'default' })

const beliefs = [
  { icon: '📖', title: '聖經與經文', desc: '我們相信聖經是神的話語，同時也使用摩爾門經、教義和聖約及無價珍珠作為另外的經文。' },
  { icon: '✝️', title: '耶穌基督', desc: '我們相信耶穌基督是世界的救主與救贖主，透過祂的贖罪，所有人都能得到救恩。' },
  { icon: '👨‍👩‍👧‍👦', title: '家庭永恆', desc: '家庭是神計劃的核心。透過聖殿裡的神聖聖約，家庭關係可以在今生與來世都持續存在。' },
  { icon: '🤝', title: '互助關懷', desc: '我們致力於互相幫助、服務社區，實踐對神和對人的愛。' },
]
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">

    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">認識我們</h1>
    <div class="w-12 h-1 bg-blue-600 rounded mb-8"></div>

    <!-- 簡介 -->
    <section class="mb-10">
      <div class="flex flex-col md:flex-row gap-8 items-center">
        <div class="md:w-1/2">
          <img src="/english/taidong.jpg" alt="台東一支會" class="w-full rounded-2xl shadow-lg object-cover" />
        </div>
        <div class="md:w-1/2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">台東第一支會</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            台東第一支會是耶穌基督後期聖徒教會在台東的地方聚會單位，成立於 1971 年，是台東地區歷史悠久的教會社群。
          </p>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            我們歡迎所有人前來參加聚會，無論您是否是教會成員，都可以和我們一起敬拜、學習，並感受到家的溫暖。
          </p>
          <NuxtLink to="/front/meeting"
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            查看聚會資訊 →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 我們的信仰 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
        我們的信仰
      </h2>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
        <div v-for="b in beliefs" :key="b.title"
             class="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <span class="text-3xl block mb-3">{{ b.icon }}</span>
          <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ b.title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ b.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 聯絡資訊 -->
    <section class="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-6 py-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">聯絡我們</h2>
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span class="text-xl">📍</span>
          <span>台東市正氣北路 206 號</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span class="text-xl">📞</span>
          <span>089-325240</span>
        </div>
        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <span class="text-xl">🕙</span>
          <span>每週日上午 10:00 聚會</span>
        </div>
      </div>
    </section>

  </div>
</template>
