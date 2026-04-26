<script setup lang="ts">
definePageMeta({ layout: 'default' })

const links = [
  {
    name: '耶穌基督後期聖徒教會網站',
    url: 'https://www.churchofjesuschrist.org/?lang=zho',
    desc: '官方教會網站',
    icon: '⛪',
  },
  {
    name: '耶穌基督後期聖徒教會 YouTube',
    url: 'https://www.youtube.com/@MormonMessagesCHI',
    desc: '官方中文 YouTube 頻道',
    icon: '▶️',
  },
  {
    name: '台灣英文會話小組',
    url: 'https://taiwaneng.com/',
    desc: '英文學習資源',
    icon: '🗣️',
  },
  {
    name: 'FamilySearch 族譜',
    url: 'https://www.familysearch.org/zh/home/',
    desc: '在線族譜及家庭樹資源',
    icon: '🌳',
  },
]
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">連結</h1>
    <div class="w-12 h-1 bg-blue-600 rounded mb-8"></div>

    <div class="flex flex-col gap-3">
      <a
          v-for="l in links"
          :key="l.url"
          :href="l.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500
               hover:shadow-md transition-all duration-200">
        <!-- Icon -->
        <span class="text-2xl flex-none">{{ l.icon }}</span>
        <!-- 文字 -->
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {{ l.name }}
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{{ l.desc }}</p>
        </div>
        <!-- 箭頭 -->
        <svg class="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 flex-none transition-colors"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</template>