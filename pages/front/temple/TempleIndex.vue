<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">聖殿日列表</h1>
    <div class="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-600">
      <table class="w-full text-left">
        <thead class="bg-green-100 dark:bg-green-900">
          <tr>
            <th class="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">#</th>
            <th class="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">時間</th>
            <th class="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">報名截止日</th>
            <th class="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">詳細訊息</th>
          </tr>
        </thead>
        <tbody>
          <tr class="even:bg-gray-50 dark:even:bg-gray-800">
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">1</td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">9/16-星期六</td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">2023/9/3</td>
            <td class="px-4 py-3 text-sm"><NuxtLink class="text-blue-600 dark:text-blue-400 hover:underline" to="/front/temple/Temple-2023-09-16">請點擊</NuxtLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
