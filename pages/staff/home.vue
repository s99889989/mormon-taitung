<script setup lang="ts">
definePageMeta({ layout: 'staff' })

import { useCustomerStore } from '~/stores/customer'
const customerStore = useCustomerStore()
const customer = computed(() => customerStore.data.customer)

const cards = [
  {
    to: '/staff/activity/list',
    label: '活動管理',
    desc: '新增、編輯、刪除活動',
    icon: 'fa-solid fa-calendar-days',
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    to: '/staff/roll_call/list',
    label: '點名管理',
    desc: '建立點名表、記錄出席',
    icon: 'fa-solid fa-clipboard-check',
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    to: '/staff/member/list',
    label: '成員名單',
    desc: '查看與管理支會成員',
    icon: 'fa-solid fa-users',
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400',
  },
  {
    to: '/staff/family/list',
    label: '家庭管理',
    desc: '家庭資料與探訪紀錄',
    icon: 'fa-solid fa-house-chimney-user',
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
  },
  {
    to: '/staff/photo/list',
    label: '照片管理',
    desc: '上傳與管理相片集',
    icon: 'fa-solid fa-images',
    color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400',
  },
  {
    to: '/staff/html/list',
    label: '網站頁面',
    desc: '管理自訂 HTML 頁面',
    icon: 'fa-solid fa-file-code',
    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400',
  },
  {
    to: '/staff/link/list',
    label: '連結管理',
    desc: '管理對外連結清單',
    icon: 'fa-solid fa-link',
    color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400',
  },
  {
    to: '/staff/setting/main',
    label: '設定',
    desc: '修改密碼與帳號設定',
    icon: 'fa-solid fa-gear',
    color: 'text-gray-600 bg-gray-100 dark:bg-gray-700/40 dark:text-gray-400',
  },
]

// ADMIN 額外顯示帳號管理入口
const isAdmin = computed(() => customer.value?.role === 'ADMIN')
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-24 pb-12">

    <!-- 歡迎標題 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        幹部專區
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        歡迎，{{ customer?.name || '幹部' }}
        <span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {{ customer?.role }}
        </span>
      </p>
    </div>

    <!-- 功能卡片 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <NuxtLink
          v-for="card in cards"
          :key="card.to"
          :to="card.to"
          class="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200
                 dark:border-gray-700 bg-white dark:bg-gray-800/50
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div :class="card.color" class="w-12 h-12 rounded-xl flex items-center justify-center">
          <i :class="card.icon" class="text-xl"></i>
        </div>
        <div class="text-center">
          <p class="font-semibold text-gray-800 dark:text-white text-sm">{{ card.label }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{{ card.desc }}</p>
        </div>
      </NuxtLink>

      <!-- ADMIN 才看得到的帳號管理 -->
      <NuxtLink
          v-if="isAdmin"
          to="/admin"
          class="flex flex-col items-center gap-3 p-5 rounded-2xl border border-red-200
                 dark:border-red-800/40 bg-white dark:bg-gray-800/50
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
          <i class="fa-solid fa-shield-halved text-xl"></i>
        </div>
        <div class="text-center">
          <p class="font-semibold text-red-700 dark:text-red-400 text-sm">帳號管理</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">管理成員角色與狀態</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>