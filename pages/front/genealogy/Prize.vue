<script setup lang="ts">
definePageMeta({ layout: 'default' })

const openItem = ref<string | null>(null)
const toggle = (id: string) => {
  openItem.value = openItem.value === id ? null : id
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">櫃台+獎品製作</h1>

    <div class="flex flex-col gap-2">

      <!-- 手風琴項目 -->
      <div v-for="item in [
        { id: 'counter', title: '櫃台注意事項', type: 'pdf', src: '/genealogy/必看櫃台事項.pdf' },
        { id: 'badge', title: '徽章製作流程', type: 'pdf', src: '/genealogy/徽章製作流程.pdf' },
        { id: 'video', title: '徽章製作影片', type: 'video' },
        { id: 'card', title: '活動集點卡', type: 'image', src: '/genealogy/活動集點卡.png' },
        { id: 'links', title: '一些連結', type: 'links' },
      ]" :key="item.id"
        class="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">

        <button @click="toggle(item.id)"
          class="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          {{ item.title }}
          <svg :class="openItem === item.id ? 'rotate-180' : ''"
            class="w-5 h-5 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
          </svg>
        </button>

        <div v-show="openItem === item.id" class="p-4 bg-white dark:bg-gray-800">

          <!-- PDF -->
          <div v-if="item.type === 'pdf'">
            <iframe :src="item.src" class="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700"></iframe>
          </div>

          <!-- 圖片 -->
          <div v-else-if="item.type === 'image'">
            <img :src="item.src" class="w-full rounded-lg" alt="活動集點卡" />
          </div>

          <!-- 影片 -->
          <div v-else-if="item.type === 'video'" class="flex flex-col gap-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="aspect-square">
                <iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/TRnIKx2DiNA?si=tCyV4R0yyuEzqv3H"
                  title="YouTube video player" frameborder="0" allowfullscreen></iframe>
              </div>
              <div class="aspect-square">
                <iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/qAzXLFLluO8?si=fFW7KzW-7-Ns81Kn"
                  title="YouTube video player" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>
            <div class="aspect-video">
              <iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/gMPn93rivoM?si=q-oLiUe1gyQ0aNBt"
                title="YouTube video player" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>

          <!-- 連結 -->
          <div v-else-if="item.type === 'links'" class="flex flex-col gap-2">
            <a href="https://www.canva.com/design/DAFqi3_ejjw/ldpq2kuX73jw_VaWEHksXQ/view?utm_content=DAFqi3_ejjw&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview"
              target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
              進群QR code範本
            </a>
            <a href="https://www.canva.com/design/DAFrx-VXjXI/SflaopdJaEhK--4xq7iAbA/view?utm_content=DAFrx-VXjXI&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview"
              target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
              徽章製作範本
            </a>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
