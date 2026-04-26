<script setup lang="ts">
definePageMeta({ layout: 'photo' })

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

const buildPath = (year: string, key: string, day: string, type: 'photo' | 'video') => {
  const folder = key.includes('hualien') ? 'hualien' : `第${key.split('-')[1]}回`
  const pathArr = type === 'photo'
    ? ['ysa', 'image', year, folder, day]
    : ['ysa', 'video', year, folder, day]
  const title = `${year}-${folder}-${day}-${type === 'photo' ? '照片' : '影片'}`
  return `/photo/gallery?path=${encodeURIComponent(JSON.stringify(pathArr))}&title=${encodeURIComponent(title)}&type=${type}`
}

const buildHualienPhotoPath = (year: string) => {
  const pathArr = ['ysa', 'image', year, 'hualien']
  const title = `${year}-花蓮支聯會-照片`
  return `/photo/gallery?path=${encodeURIComponent(JSON.stringify(pathArr))}&title=${encodeURIComponent(title)}&type=photo`
}

const buildHualienVideoPath = (year: string, day: string) => {
  const pathArr = ['ysa', 'video', year, 'hualien', day]
  const title = `${year}-花蓮支聯會-${day}-影片`
  return `/photo/gallery?path=${encodeURIComponent(JSON.stringify(pathArr))}&title=${encodeURIComponent(title)}&type=video`
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold dark:text-white text-gray-900 mb-2">活動相簿</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8">年輕單身成人大會照片與影片紀錄</p>

    <div class="space-y-8">
      <div v-for="y in years" :key="y.year">
        <h2 class="text-xl font-bold dark:text-white text-gray-900 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {{ y.year }}
        </h2>
        <div class="space-y-4">
          <div v-for="ev in y.events" :key="ev.key"
               class="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <p class="font-semibold text-gray-800 dark:text-gray-200 mb-3">{{ ev.label }}</p>
            <div class="flex flex-wrap gap-2">
              <template v-for="day in ev.days" :key="day">
                <!-- 照片 -->
                <NuxtLink
                  v-if="ev.folder === 'hualien'"
                  :to="buildHualienPhotoPath(y.year)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                         bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                         hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800">
                  📷 照片
                </NuxtLink>
                <NuxtLink
                  v-else
                  :to="buildPath(y.year, ev.key, day, 'photo')"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                         bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                         hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800">
                  📷 {{ day }} 照片
                </NuxtLink>
                <!-- 影片 -->
                <NuxtLink
                  v-if="ev.folder === 'hualien'"
                  :to="buildHualienVideoPath(y.year, day)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                         bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                         hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-800">
                  🎬 {{ day }} 影片
                </NuxtLink>
                <NuxtLink
                  v-else
                  :to="buildPath(y.year, ev.key, day, 'video')"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                         bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300
                         hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-800">
                  🎬 {{ day }} 影片
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
