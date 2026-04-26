<script setup lang="ts">
definePageMeta({ layout: 'default' })

const bishops = [
  { name: '林展棻' },
  { name: '莊啟明' },
  { name: '郝宗坤' },
  { name: '廖萬連' },
  { name: '楊哲雄' },
  { name: '張松茂' },
  { name: '陳建年' },
  { name: '林新福' },
  { period: '1987–1991', name: '林鄉' },
  { period: '1991–1993', name: '李炎' },
  { period: '1993–1996', name: '林清崑' },
  { period: '1996–1997.4.20', name: '邵宗雍' },
  { period: '1997.4.20–1997.9.14', name: '陳泰榮' },
  { period: '1997.9.14–1999.4.18', name: '鄭聰敏' },
  { period: '1999.4.18–2000.3.5', name: '邵宗雍' },
  { period: '2000.3.5–2004.3.7', name: '王金星' },
  { period: '2004.3.7–2011.9.25', name: '蔡文方' },
  { period: '2011.9.25–2013.3.3', name: '張繼中' },
  { period: '2013.3.3–2014.3.16', name: '侯信裕' },
  { period: '2014.3.16–2015.6.21', name: '賴勝豐（會長）' },
  { period: '2015.6.21–2018.9.16', name: '賴勝豐（主教）' },
  { period: '2018.9.16–', name: '鄭正' },
]

const addresses = [
  { year: '1971', address: '台東鎮強國街 68 號' },
  { year: '1972', address: '台東鎮中山路 363 號' },
  { year: '1975', address: '台東鎮永樂街 35 號 2 樓' },
  { year: '1975', address: '台東鎮鐵發路 292 號' },
  { year: '1975.8.2', address: '台東市正氣北路 206 號' },
]

const events = [
  { date: '1971.1.16', text: '台東第一支會成立（單位號碼：93793）' },
  { date: '1972.4.9', text: '成立台東分會' },
  { date: '1975.6', text: '教堂落成' },
  { date: '1975.8.2', text: '教堂啟用' },
  { date: '1987.7–11月', text: '教堂擴建' },
  { date: '1990.6', text: '自台中傳道部改隸台北傳道部' },
  { date: '2000.1.8', text: '教堂第二次擴建動土' },
  { date: '2000.8.13', text: '劃分出鹿野分會' },
  { date: '2004.3.7', text: '鹿野分會重新併入台東分會' },
  { date: '2008.3.30', text: '劃分台東第二分會，台東分會更名為台東第一分會' },
  { date: '2015.6.21', text: '花蓮支聯會成立，台東第一分會成為台東第一支會，由賴勝豐擔任主教' },
]

const photos = [
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430045.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=680%2B453',
    caption: '成員合照'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430232.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=680%2B462&extract=0%2B0%2B680%2B462',
    caption: '成員合照 2'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430297.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=680%2B453&extract=0%2B0%2B680%2B453',
    caption: '成員合照 3'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430363.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=680%2B424&extract=0%2B0%2B680%2B424',
    caption: '台北聖殿前留影'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430641.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=680%2B510',
    caption: '台東教堂 – 1972年落成，1974年奉獻，擴建二次\n台東市正氣北路206號'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430434._szw480h1280_.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=333%2B230&extract=0%2B0%2B333%2B229',
    caption: '台灣傳道部會長倪爾遜第一次訪問台東教會'
  },
  {
    src: 'https://impro.usercontent.one/appid/oneComWsb/domain/ldstaiwanhistory.com/media/ldstaiwanhistory.com/onewebmedia/i286823014283430563._szw480h1280_.jpg?etag=%221b68c-5db44839af051%22&sourceContentType=&ignoreAspectRatio&resize=333%2B557&extract=0%2B0%2B333%2B557',
    caption: '台東分會第一位台灣籍傳教士范運財長老'
  },
]

const notables = ['李炎', '陳泰榮', '賴勝豐', '林新福', '陳松春', '張松茂', '王金星', '蔡文方', '陳建年']
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">

    <!-- 標題 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">台東第一支會</h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">Taitung 1st Ward</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">單位號碼：93793　｜　成立日期：1971年1月16日</p>
      <p class="text-sm text-gray-400 dark:text-gray-500">原屬單位：台東分會</p>
    </div>

    <!-- 主要照片 -->
    <div class="mb-10">
      <img
        :src="photos[0].src"
        :alt="photos[0].caption"
        class="w-full rounded-2xl shadow-lg object-cover"
      />
      <p class="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">{{ photos[0].caption }}</p>
    </div>

    <!-- 歷任主教/會長 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        歷任主教／會長
      </h2>
      <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-green-50 dark:bg-green-900/30">
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 w-52">任期</th>
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">姓名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(b, i) in bishops" :key="i" class="even:bg-gray-50 dark:even:bg-gray-800/50">
              <td class="px-4 py-2.5 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/50">
                {{ b.period || '—' }}
              </td>
              <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700/50 font-medium">
                {{ b.name }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 教堂地址沿革 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        教堂地址沿革
      </h2>
      <div class="space-y-2">
        <div
          v-for="(a, i) in addresses"
          :key="i"
          class="flex gap-4 items-start bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3"
        >
          <span class="text-sm font-semibold text-green-700 dark:text-green-400 w-24 flex-none">{{ a.year }}</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ a.address }}</span>
        </div>
      </div>
    </section>

    <!-- 重要史料 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        重要史料
      </h2>
      <ol class="relative border-l border-green-200 dark:border-green-800 ml-3 space-y-4">
        <li v-for="(e, i) in events" :key="i" class="pl-6">
          <span class="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-green-500 dark:bg-green-400"></span>
          <p class="text-xs font-semibold text-green-700 dark:text-green-400">{{ e.date }}</p>
          <p class="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{{ e.text }}</p>
        </li>
      </ol>
    </section>

    <!-- 照片牆 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        歷史照片
      </h2>
      <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
        <div v-for="(p, i) in photos" :key="i" class="rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-700">
          <img :src="p.src" :alt="p.caption" class="w-full object-cover" />
          <p class="text-xs text-center text-gray-500 dark:text-gray-400 px-2 py-2 whitespace-pre-line bg-white dark:bg-gray-800">{{ p.caption }}</p>
        </div>
      </div>
    </section>

    <!-- 人物誌 -->
    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        人物誌
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="name in notables"
          :key="name"
          class="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
        >
          {{ name }}
        </span>
      </div>
    </section>

    <!-- 來源 -->
    <p class="text-xs text-gray-400 dark:text-gray-600 text-right">
      資料來源：
      <a
        href="https://ldstaiwanhistory.com/432372599/432637963"
        target="_blank"
        class="underline hover:text-gray-500"
      >台灣教會歷史網站</a>
    </p>

  </div>
</template>
