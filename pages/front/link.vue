<script setup lang="ts">
definePageMeta({ layout: 'default' })
const links = [
  { name: '耶穌基督後期聖徒教會網站', url: 'https://www.churchofjesuschrist.org/?lang=zho' },
  { name: '耶穌基督後期聖徒教會Youtube', url: 'https://www.youtube.com/@MormonMessagesCHI' },
  { name: '台灣英文會話小組', url: 'https://taiwaneng.com/' },
  { name: '在線族譜及家庭樹資源• FamilySearch', url: 'https://www.familysearch.org/zh/home/' },
]
</script>
<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">連結</h1>
    <div class="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-600">
      <table class="w-full text-left border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th class="px-4 py-3 bg-green-100 dark:bg-green-900 text-gray-800 dark:text-gray-100 font-semibold text-sm border-b border-gray-300 dark:border-gray-600">名稱</th>
            <th class="px-4 py-3 bg-green-100 dark:bg-green-900 text-gray-800 dark:text-gray-100 font-semibold text-sm border-b border-gray-300 dark:border-gray-600">連結</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in links" :key="l.url" class="even:bg-gray-50 dark:even:bg-gray-800">
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{{ l.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"><a :href="l.url" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">前往</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>