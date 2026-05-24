<template>
  <div class="container-top bg-gray-100 dark:bg-gray-950 min-h-screen">
    <div class="max-w-3xl mx-auto px-4">

      <!-- Header -->
      <div class="relative overflow-hidden bg-[#1a2e5a] rounded-2xl text-center px-6 py-8 mb-4">
        <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-yellow-300/10 pointer-events-none"></div>
        <div class="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-red-600/20 pointer-events-none"></div>
        <span class="relative inline-block bg-yellow-300 text-[#1a2e5a] text-sm font-bold px-4 py-1 rounded-full tracking-widest mb-3">
          第二組 · 大會資訊
        </span>
        <h1 class="relative text-3xl md:text-4xl font-bold text-white mb-1">2026 全國年輕單成大會</h1>
        <p class="relative text-base text-white/70">信賴祂</p>
        <div class="relative mt-3 flex flex-col items-center gap-1 text-sm text-white/60">
          <p>📅 6/18（四）– 6/20（六）</p>
          <p>📍 台南十股文創園區</p>
        </div>
      </div>

      <!-- 大會官方連結 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          官方連結
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <a href="https://www.instagram.com/tw_ysac?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
             target="_blank"
             class="flex items-center gap-3 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span class="text-2xl">📸</span>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">官方 Instagram</p>
              <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">@tw_ysac</p>
            </div>
          </a>
          <a href="https://line.me/R/ti/p/@373qqdfr"
             target="_blank"
             class="flex items-center gap-3 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span class="text-2xl">💬</span>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">官方 LINE</p>
              <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">@373qqdfr</p>
            </div>
          </a>
        </div>
      </div>

      <!-- 服裝規定 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          舞會服裝規定（第二天晚上）
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- 男生 -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300 mb-2">👔 男生</p>
            <p class="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              藏青色襯衫<br>搭配黑色或米色褲子
            </p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-[#1a2e5a] text-blue-200">藏青領帶</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-yellow-300 text-yellow-900">黃色領帶</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-red-700 text-red-100">紅色領帶</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              沒有藏青上衣也無法取得者，可穿白色襯衫搭配彩色領帶／配件
            </p>
          </div>
          <!-- 女生 -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300 mb-2">👗 女生</p>
            <p class="text-base text-gray-800 dark:text-gray-200 leading-relaxed">
              藏青＋黃色<br>洋裝 或 上衣＋裙子
            </p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-[#1a2e5a] text-blue-200">藏青</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-yellow-300 text-yellow-900">黃色</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              可參考白雪公主配色（藍色上衣＋黃色裙子）
            </p>
          </div>
        </div>
      </div>

      <!-- 服裝參考照 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          服裝參考照（1–4組）
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div v-for="img in images" :key="img.src" class="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-200 dark:bg-gray-800">
            <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 right-0 bg-[#1a2e5a]/80 text-white text-sm text-center py-1 px-1">
              {{ img.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- 大會領袖 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          大會領袖
        </p>
        <div v-for="(leader, i) in leaders" :key="leader.role"
             :class="i < leaders.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''"
             class="flex gap-3 py-2.5 text-base">
          <span class="text-gray-500 dark:text-gray-400 w-28 flex-none">{{ leader.role }}</span>
          <span class="text-gray-900 dark:text-gray-100 font-medium">{{ leader.name }}</span>
        </div>
      </div>

      <!-- 聯絡人 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          聯絡人
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="c in contacts" :key="c.name"
               class="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{{ c.role }}</p>
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">{{ c.name }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed" v-html="c.detail" />
          </div>
        </div>
      </div>

      <!-- 大會行程 Timeline -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-5 border-b border-gray-200 dark:border-gray-700">
          大會行程（6/18–6/20）
        </p>

        <div v-for="(day, di) in schedule" :key="day.date" class="mb-6 last:mb-0">
          <!-- 日期標題 -->
          <div class="flex items-center gap-3 mb-3">
            <div class="w-2.5 h-2.5 rounded-full bg-[#1a2e5a] dark:bg-blue-400 flex-none"></div>
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">{{ day.date }}</p>
          </div>

          <!-- 時間軸 items -->
          <div class="ml-[5px] pl-6 border-l-2"
               :class="di < schedule.length - 1 ? 'border-gray-300 dark:border-gray-700' : 'border-transparent'">
            <div v-for="(row, ri) in day.rows" :key="row.time" class="relative mb-4 last:mb-0">
              <!-- 圓點 -->
              <div class="absolute -left-[29px] top-[6px] w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 ring-2 ring-white dark:ring-gray-900"></div>
              <!-- 內容 -->
              <div class="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3">
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:w-24 flex-none">{{ row.time }}</span>
                <div>
                  <p class="text-base text-gray-900 dark:text-gray-100 font-medium">{{ row.desc }}</p>
                  <p v-if="row.sub" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{{ row.sub }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 各隊待辦 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
          各隊待辦事項
        </p>
        <ul>
          <li v-for="task in tasks" :key="task"
              class="flex gap-3 py-2.5 text-base text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <span class="flex-none mt-0.5">🚩</span>
            <span v-html="task" />
          </li>
        </ul>
      </div>

      <!-- 奇美連結 -->
      <div class="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-800 rounded-xl px-4 py-3 mb-4 text-base text-yellow-900 dark:text-yellow-300 leading-relaxed">
        🏛 奇美博物館參觀資訊：
        <a href="https://www.chimeimuseum.org/visit" target="_blank"
           class="text-[#1a2e5a] dark:text-blue-400 underline underline-offset-2">
          www.chimeimuseum.org/visit
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({layout: 'blank'})

const BASE = '/active/2026/single_adults/'

const images = [
  {src: `${BASE}LINE_NOTE_260523_1.jpg`, alt: '男生領帶參考 1 — 黃色佩斯利領帶', label: '男 · 黃色領帶'},
  {src: `${BASE}LINE_NOTE_260523_2.jpg`, alt: '男生領帶參考 2 — 藏青領帶套裝', label: '男 · 藏青領帶'},
  {src: `${BASE}LINE_NOTE_260523_3.jpg`, alt: '男生領帶參考 3 — 紅色領帶', label: '男 · 紅色領帶'},
  {src: `${BASE}LINE_NOTE_260523_4.jpg`, alt: '女生參考 1 — 藍外套黃裙', label: '女 · 藍外套黃裙'},
  {src: `${BASE}LINE_NOTE_260523_5.jpg`, alt: '女生參考 2 — 白雪公主洋裝', label: '女 · 白雪公主裝'},
  {src: `${BASE}LINE_NOTE_260523_6.jpg`, alt: '女生參考 3 — 藍上衣黃裙', label: '女 · 藍上衣黃裙'},
  {src: `${BASE}LINE_NOTE_260523_7.jpg`, alt: '男生穿搭參考 1 — 藏青襯衫', label: '男 · 藏青襯衫 1'},
  {src: `${BASE}LINE_NOTE_260523_8.jpg`, alt: '男生穿搭參考 2 — 藏青襯衫', label: '男 · 藏青襯衫 2'},
]

const leaders = [
  {role: '區域七十員', name: '楊世寧會長'},
  {role: '支聯會', name: '東台中支聯會 劉邦建會長'},
]

const contacts = [
  {role: '總召', name: '王奎棟', detail: '0966-409-782<br>LINE: elderktw'},
  {role: '總召', name: '黃靖媛', detail: '0907-716-873<br>LINE: ouo...ouo...ouo'},
  {role: '隊輔長', name: '李詩琳', detail: '0938-917-066'},
  {role: '醫護組', name: '郭之文', detail: '0908-785-673<br>LINE: justtypeit'},
  {role: '醫護組', name: '陳心瑜', detail: '0979-812-876<br>LINE: chen10059158'},
  {role: '醫護組', name: '陳怡璇', detail: '0975-110-191<br>LINE: ghj6722'},
  {role: '場地組', name: '杜祐萱', detail: '0963-210-501<br>LINE: tra19930420'},
]

const schedule = [
  {
    date: '第一天 6/18（四）',
    rows: [
      {time: '13:30–14:00', desc: '報到'},
      {time: '下午', desc: '大會開始'},
    ],
  },
  {
    date: '第二天 6/19（五）',
    rows: [
      {
        time: '上午',
        desc: '服務活動 ／ 課程',
        sub: '吳宣澔、彥廷、恩淩 Sarah — 中高齡營養實務課程（限額50名，單獨行動至午餐）'
      },
      {time: '下午', desc: '奉行福音活動 — 奇美博物館', sub: '門票由大會支付，台南市民請攜帶身份證'},
      {time: '18:00(預估)', desc: '舞會（白雪公主主題）', sub: '第二組著藏青＋黃色配色'},
    ],
  },
  {
    date: '第三天 6/20（六）',
    rows: [
      {time: '上午', desc: '大會活動'},
      {time: '14:00(預估)', desc: '大會結束'},
    ],
  },
]

const tasks = [
  '統計哪些人<strong>較晚到或較早離開</strong>，並附明確時間',
  '統計持有<strong>台南市民卡</strong>的成員（台南人 / 在台南讀書），請攜帶身份證或學生證',
  '邀請 <strong>18–22 歲</strong>成員攜帶可證明年紀的證件（身份證等）',
]
</script>