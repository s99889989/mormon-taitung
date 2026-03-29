<script setup lang="ts">
import { useDarkModeStore } from "~/stores/dark_mode"

const dark_mode = useDarkModeStore()
const route = useRoute()

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <div class="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="grid h-full grid-cols-6">

      <!-- 首頁 -->
      <NuxtLink to="/"
                :class="route.path === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
        </svg>
        <span class="text-xs font-medium">首頁</span>
      </NuxtLink>

      <!-- 活動 -->
      <NuxtLink to="/admin/activity/list"
                :class="isActive('/admin/activity') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
        </svg>
        <span class="text-xs font-medium">活動</span>
      </NuxtLink>

      <!-- 點名 -->
      <NuxtLink to="/admin/roll_call/list"
                :class="isActive('/admin/roll_call') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 18 20">
          <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z"/>
        </svg>
        <span class="text-xs font-medium">點名</span>
      </NuxtLink>

      <!-- 人員 -->
      <NuxtLink to="/admin/member/list"
                :class="isActive('/admin/member') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 14 18">
          <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
        </svg>
        <span class="text-xs font-medium">人員</span>
      </NuxtLink>

      <!-- 家庭 -->
      <NuxtLink to="/admin/family/list"
                :class="isActive('/admin/family') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 19">
          <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"/>
          <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z"/>
        </svg>
        <span class="text-xs font-medium">家庭</span>
      </NuxtLink>

      <!-- 開燈/關燈 -->
      <button
          @click="dark_mode.change_dark_mode"
          class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 14 20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 7a3 3 0 0 1 3-3M5 19h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 1 7c0 4 4 5 4 9h4Z"/>
        </svg>
        <span class="text-xs font-medium">{{ dark_mode.data.display_name }}</span>
      </button>

    </div>
  </div>
</template>

<style scoped>
</style>