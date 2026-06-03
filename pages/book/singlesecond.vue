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

      <!-- 官方連結 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">官方連結</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <a href="https://www.instagram.com/tw_ysac?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"
             class="flex items-center gap-3 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span class="text-2xl">📸</span>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">官方 Instagram</p>
              <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">@tw_ysac</p>
            </div>
          </a>
          <a href="https://line.me/R/ti/p/@373qqdfr" target="_blank"
             class="flex items-center gap-3 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span class="text-2xl">💬</span>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">官方 LINE</p>
              <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">@373qqdfr</p>
            </div>
          </a>
        </div>
      </div>

      <!-- 第二組名單 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">第二組名單</p>
        <div class="mb-3 flex gap-2 flex-wrap">
          <span class="text-sm bg-[#1a2e5a] text-white px-3 py-1 rounded-full font-medium">隊輔：許少芸（桃園中壢）</span>
          <span class="text-sm bg-[#1a2e5a] text-white px-3 py-1 rounded-full font-medium">副隊輔：吳旻軒（南高雄小港）</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-base border-collapse">
            <thead>
            <tr class="bg-gray-100 dark:bg-gray-800">
              <th class="text-left px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-tl-lg">姓名</th>
              <th class="text-left px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold">性別</th>
              <th class="text-left px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold">支聯會</th>
              <th class="text-left px-3 py-2 text-gray-600 dark:text-gray-300 font-semibold rounded-tr-lg">支會</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(m, i) in members" :key="m.name"
                :class="[i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50', m.highlight ? 'ring-1 ring-inset ring-yellow-400' : '']">
              <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                <span v-if="m.highlight" class="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1.5 align-middle"></span>
                {{ m.name }}
                <span v-if="m.note" class="block text-xs text-orange-500 dark:text-orange-400 font-normal mt-0.5">⚠️ {{ m.note }}</span>
              </td>
              <td class="px-3 py-2 text-gray-700 dark:text-gray-300">{{ m.gender }}</td>
              <td class="px-3 py-2 text-gray-700 dark:text-gray-300">{{ m.stake }}</td>
              <td class="px-3 py-2 text-gray-700 dark:text-gray-300">{{ m.ward }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span class="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1 align-middle"></span>
          黃色標記：參加中高齡營養實務課程（第二天上午單獨行動）
        </p>
      </div>

      <!-- 場地與地圖 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">場地與地圖</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">主要住宿</p>
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">捷絲旅 台南虎山館</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">22.937873, 120.230245</p>
            <a href="https://maps.google.com/?q=22.937873,120.230245" target="_blank"
               class="inline-block mt-2 text-sm text-[#1a2e5a] dark:text-blue-400 underline underline-offset-2">Google Maps 導航 →</a>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">大會活動場地</p>
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">十鼓文創園區 二館</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">距捷絲旅步行約 7–8 分鐘</p>
            <a href="https://maps.google.com/?q=十鼓文創園區永不出軌宴會廳二館" target="_blank"
               class="inline-block mt-2 text-sm text-[#1a2e5a] dark:text-blue-400 underline underline-offset-2">Google Maps 導航 →</a>
          </div>
        </div>
        <!-- 地圖圖片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div class="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
            <img :src="`${BASE}LINE_ALBUM_第二組名單呦～(場地跟地圖也放一起)_260525_1.jpg`" alt="場地衛星圖與步行路線" class="w-full h-auto object-cover">
            <p class="text-sm text-gray-600 dark:text-gray-400 px-3 py-2">衛星圖 · 捷絲旅 → 十鼓文創</p>
          </div>
          <div class="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
            <img :src="`${BASE}LINE_ALBUM_第二組名單呦～(場地跟地圖也放一起)_260525_3.jpg`" alt="園區總覽與奇美博物館路線" class="w-full h-auto object-cover">
            <p class="text-sm text-gray-600 dark:text-gray-400 px-3 py-2">園區總覽 · 奇美博物館路線（步行13分）</p>
          </div>
        </div>
      </div>

      <!-- 住宿照片 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">住宿 · 捷絲旅 台南虎山館</p>
        <div class="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img :src="`${BASE}LINE_ALBUM_第二組名單呦～(場地跟地圖也放一起)_260525_2.jpg`" alt="住宿房間與十鼓二館空間" class="w-full h-auto object-cover">
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">房型為多人房，二館為大會活動空間（右上角標示「2館」）</p>
      </div>

      <!-- 入住須知 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <button @click="showCheckin = !showCheckin"
                class="w-full flex items-center justify-between gap-2 text-left">
          <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">捷絲旅 · 入住須知</p>
          <span class="text-gray-400 dark:text-gray-500 transition-transform duration-200 text-lg leading-none"
                :class="showCheckin ? 'rotate-180' : ''">▾</span>
        </button>
        <div v-if="showCheckin" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2.5 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🕓</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">入住 ／ 退房</span>：下午 4 點後 Check in，中午 12 點前 Check out</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">📶</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">WiFi</span>：搜尋 <span class="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">JustSleep</span>，無需密碼</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🍳</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">早餐</span>：06:30–10:30，一樓捷食藝，報房號即可（無餐券）</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🛗</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">電梯</span>：感應房卡再按樓層，樓層管制互不相通。大門 23:00–06:00 門禁，務必帶房卡</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">📞</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">房內電話</span>：撥 9 聯絡櫃台；互撥為 2＋房號；撥打國內外線電話費用另計</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🏊</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">一樓泳池</span>：09:00–11:30 ／ 13:00–17:30（依天氣調整）。需著泳衣＋泳帽，泳池全區禁飲食</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🎮</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">二樓鼓逸廊</span>：24 小時，請降低音量。戶外露臺＋洗衣間（投幣式）開放 08:00–22:00</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🛵</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">外送</span>：需自行下樓與外送員點交，櫃台不代收</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🚭</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">禁菸</span>：全館禁菸（含陽台、二樓戶外露臺），違者酌收 $2,000 清潔費</p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">🪥</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">盥洗用品</span>：依台南市條例，飯店不提供一次性衛生用品（梳子、牙刷、牙膏、刮鬍刀、刮鬍膏、浴帽），<span class="text-red-600 dark:text-red-400 font-medium">請自備</span></p>
          </div>
          <div class="flex gap-2.5">
            <span class="flex-none text-lg">💧</span>
            <p><span class="font-medium text-gray-900 dark:text-gray-100">飲水</span>：無瓶裝水，各樓層設有飲水機，可用房內環保冷水壺或自備容器</p>
          </div>
          <div class="mt-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
            📞 捷絲旅台南虎山館櫃台：<a href="tel:062660568" class="underline underline-offset-2 text-[#1a2e5a] dark:text-blue-400">06-2660568</a>
          </div>
        </div>
      </div>

      <!-- 大會行程 Tab -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">大會行程（6/18–6/20）</p>

        <!-- Tab 按鈕 -->
        <div class="flex gap-2 mb-5">
          <button v-for="(day, di) in schedule" :key="day.date"
                  @click="activeDay = di"
                  :class="activeDay === di
                    ? 'bg-[#1a2e5a] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
                  class="flex-1 text-sm font-semibold px-3 py-2 rounded-xl transition-colors">
            <span class="block text-xs opacity-70">{{ day.label }}</span>
            {{ day.shortDate }}
          </button>
        </div>

        <!-- Timeline 內容 -->
        <div class="ml-[5px] pl-6 border-l-2 border-gray-300 dark:border-gray-700">
          <div v-for="row in schedule[activeDay].rows" :key="row.time" class="relative mb-4 last:mb-0">
            <div class="absolute -left-[29px] top-[6px] w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-900"
                 :class="row.highlight ? 'bg-yellow-400' : 'bg-gray-400 dark:bg-gray-500'"></div>
            <div class="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3">
              <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 sm:w-28 flex-none">{{ row.time }}</span>
              <div>
                <p class="text-base font-medium"
                   :class="row.highlight ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-100'">
                  {{ row.desc }}
                </p>
                <p v-if="row.sub" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{{ row.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 舞會服裝規定 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">舞會服裝規定（6/19 18:30）</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300 mb-2">👔 男生</p>
            <p class="text-base text-gray-800 dark:text-gray-200 leading-relaxed">藏青色襯衫<br>搭配黑色或米色褲子</p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-[#1a2e5a] text-blue-200">藏青領帶</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-yellow-300 text-yellow-900">黃色領帶</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-red-700 text-red-100">紅色領帶</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">沒有藏青上衣也無法取得者，可穿白色襯衫搭配彩色領帶／配件</p>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300 mb-2">👗 女生</p>
            <p class="text-base text-gray-800 dark:text-gray-200 leading-relaxed">藏青＋黃色<br>洋裝 或 上衣＋裙子</p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-[#1a2e5a] text-blue-200">藏青</span>
              <span class="text-sm font-medium px-3 py-0.5 rounded-full bg-yellow-300 text-yellow-900">黃色</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">可參考白雪公主配色（藍色上衣＋黃色裙子）</p>
          </div>
        </div>
        <!-- 服裝參考照 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          <div v-for="img in outfitImages" :key="img.src" class="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-200 dark:bg-gray-800">
            <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 right-0 bg-[#1a2e5a]/80 text-white text-sm text-center py-1 px-1">{{ img.label }}</div>
          </div>
        </div>
      </div>

      <!-- 大會領袖 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">大會領袖</p>
        <div v-for="(leader, i) in leaders" :key="leader.role"
             :class="i < leaders.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''"
             class="flex gap-3 py-2.5 text-base">
          <span class="text-gray-500 dark:text-gray-400 w-28 flex-none">{{ leader.role }}</span>
          <span class="text-gray-900 dark:text-gray-100 font-medium">{{ leader.name }}</span>
        </div>
      </div>

      <!-- 聯絡人 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">聯絡人</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="c in contacts" :key="c.name" class="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{{ c.role }}</p>
            <p class="text-base font-bold text-[#1a2e5a] dark:text-blue-300">{{ c.name }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed" v-html="c.detail" />
          </div>
        </div>
      </div>

      <!-- 各隊待辦 -->
      <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl p-5 mb-4">
        <p class="text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">各隊待辦事項</p>

        <!-- 已完成 1 -->
        <div class="mb-4">
          <div class="flex items-start gap-2 mb-2">
            <span class="flex-none text-green-500 mt-0.5">✅</span>
            <p class="text-base font-medium text-gray-500 dark:text-gray-400 line-through">統計哪些人較晚到或較早離開（並附明確時間）</p>
          </div>
          <div class="ml-7 space-y-1">
            <div class="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium text-green-700 dark:text-green-400">鄧恩凌</span> — 第二天才到，到達時間視大會活動時間表而定
            </div>
            <div class="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium text-green-700 dark:text-green-400">葉彥廷</span> — 第一天 18:00 到達
            </div>
          </div>
        </div>

        <!-- 已完成 2 -->
        <div class="mb-4">
          <div class="flex items-start gap-2 mb-2">
            <span class="flex-none text-green-500 mt-0.5">✅</span>
            <p class="text-base font-medium text-gray-500 dark:text-gray-400 line-through">統計持有台南市民卡的成員（請攜帶身份證或學生證）</p>
          </div>
          <div class="ml-7 flex flex-wrap gap-2">
            <span v-for="name in tainanCard" :key="name"
                  class="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium px-3 py-1 rounded-full">
              {{ name }}
            </span>
          </div>
        </div>

        <!-- 已完成 3 -->
        <div>
          <div class="flex items-start gap-2">
            <span class="flex-none text-green-500 mt-0.5">✅</span>
            <p class="text-base font-medium text-gray-500 dark:text-gray-400 line-through">邀請 18–22 歲成員攜帶可證明年紀的證件（身份證等）</p>
          </div>
        </div>
      </div>

      <!-- 奇美連結 -->
      <div class="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-300 dark:border-yellow-800 rounded-xl px-4 py-3 mb-4 text-base text-yellow-900 dark:text-yellow-300 leading-relaxed">
        🏛 奇美博物館參觀資訊：
        <a href="https://www.chimeimuseum.org/visit" target="_blank"
           class="text-[#1a2e5a] dark:text-blue-400 underline underline-offset-2">www.chimeimuseum.org/visit</a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({ layout: 'default' })

useHead({
  title: '2026 全國年輕單成大會 — 信賴祂',
  meta: [
    { name: 'description',        content: '第二組大會資訊 · 6/18–6/20 台南十股文創園區' },
    { property: 'og:title',       content: '2026 全國年輕單成大會 — 信賴祂' },
    { property: 'og:description', content: '第二組大會資訊 · 6/18–6/20 台南十股文創園區' },
    { property: 'og:type',        content: 'website' },
    { property: 'og:image',       content: '/active/2026/single_adults/og_cover.png' },
    { property: 'og:image:width',  content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card',        content: 'summary_large_image' },
    { name: 'twitter:title',       content: '2026 全國年輕單成大會 — 信賴祂' },
    { name: 'twitter:description', content: '第二組大會資訊 · 6/18–6/20 台南十股文創園區' },
    { name: 'twitter:image',       content: '/active/2026/single_adults/og_cover.png' },
  ],
})

const BASE = '/active/2026/single_adults/'

const members = [
  { name: '呂庭瑜', gender: '女', stake: '西台北', ward: '新埔',   highlight: false },
  { name: '鄧恩凌', gender: '女', stake: '台南',   ward: '台南一', highlight: true  },
  { name: '張苑貞', gender: '女', stake: '台南',   ward: '歸仁',   highlight: false },
  { name: '張沛宸', gender: '女', stake: '南高雄', ward: '大寮',   highlight: false, note: '第一天無法請假不會到，第二天上午到（確切時間待定）' },
  { name: '賈晴雯', gender: '女', stake: '東台中', ward: '霧峰',   highlight: false },
  { name: '吳立恩', gender: '男', stake: '中台北', ward: '信安',   highlight: false },
  { name: '葉彥廷', gender: '男', stake: '東台北', ward: '汐止',   highlight: true  },
  { name: '吳宣澔', gender: '男', stake: '花蓮',   ward: '台東一', highlight: true  },
  { name: '黃敬倫', gender: '男', stake: '台南',   ward: '台南四', highlight: false },
]

const outfitImages = [
  { src: `${BASE}LINE_NOTE_260523_1.jpg`, alt: '男生領帶參考 1 — 黃色佩斯利領帶', label: '男 · 黃色領帶' },
  { src: `${BASE}LINE_NOTE_260523_2.jpg`, alt: '男生領帶參考 2 — 藏青領帶套裝',   label: '男 · 藏青領帶' },
  { src: `${BASE}LINE_NOTE_260523_3.jpg`, alt: '男生領帶參考 3 — 紅色領帶',       label: '男 · 紅色領帶' },
  { src: `${BASE}LINE_NOTE_260523_4.jpg`, alt: '女生參考 1 — 藍外套黃裙',         label: '女 · 藍外套黃裙' },
  { src: `${BASE}LINE_NOTE_260523_5.jpg`, alt: '女生參考 2 — 白雪公主洋裝',       label: '女 · 白雪公主裝' },
  { src: `${BASE}LINE_NOTE_260523_6.jpg`, alt: '女生參考 3 — 藍上衣黃裙',         label: '女 · 藍上衣黃裙' },
  { src: `${BASE}LINE_NOTE_260523_7.jpg`, alt: '男生穿搭參考 1 — 藏青襯衫',       label: '男 · 藏青襯衫 1' },
  { src: `${BASE}LINE_NOTE_260523_8.jpg`, alt: '男生穿搭參考 2 — 藏青襯衫',       label: '男 · 藏青襯衫 2' },
]

const leaders = [
  { role: '區域七十員', name: '楊世寧會長' },
  { role: '支聯會',    name: '東台中支聯會 劉邦建會長' },
]

const contacts = [
  { role: '總召',   name: '王奎棟', detail: '0966-409-782<br>LINE: elderktw' },
  { role: '總召',   name: '黃靖媛', detail: '0907-716-873<br>LINE: ouo...ouo...ouo' },
  { role: '隊輔長', name: '李詩琳', detail: '0938-917-066' },
  { role: '醫護組', name: '郭之文', detail: '0908-785-673<br>LINE: justtypeit' },
  { role: '醫護組', name: '陳心瑜', detail: '0979-812-876<br>LINE: chen10059158' },
  { role: '醫護組', name: '陳怡璇', detail: '0975-110-191<br>LINE: ghj6722' },
  { role: '場地組', name: '杜祐萱', detail: '0963-210-501<br>LINE: tra19930420' },
]

const activeDay = ref(0)
const showCheckin = ref(false)

const schedule = [
  {
    date: '第一天 6/18（四）❤️',
    label: '第一天',
    shortDate: '6/18（四）',
    rows: [
      {time: '13:30–14:00', desc: '報到 + 確認人數', sub: '捷絲旅 ／ 十鼓二館'},
      {time: '14:00–16:00', desc: '開幕式', sub: '十鼓二館'},
      {time: '16:00–16:30', desc: 'Check in 飯店', sub: '捷絲旅（少芸會分房卡）'},
      {time: '16:30–17:30', desc: '破冰時間', sub: '捷絲旅房間（二館太窄了哈哈）'},
      {time: '17:30–18:30', desc: '晚餐', sub: '捷絲旅一樓拿食物，在哪吃你開心就好 😄'},
      {time: '18:30–18:45', desc: '經文猜猜猜', sub: '提前30分發經文，地點：捷絲旅旁邊空地'},
      {time: '18:45–19:10', desc: '說書人是你', sub: '捷絲旅旁邊空地（不要走失了！）'},
      {time: '19:10–19:20', desc: '做生命樹的葉子', sub: '二館前停車場集合'},
      {time: '19:20–20:20', desc: '祈禱會', sub: '十鼓二館內'},
      {time: '20:20–20:30', desc: '撤場後回捷絲旅'},
      {time: '20:30～', desc: '通宵玩爆時間 🎉', sub: '活動內容待討論'},
    ],
  },
  {
    date: '第二天 6/19（五）',
    label: '第二天',
    shortDate: '6/19（五）',
    rows: [
      {time: '06:30–08:30', desc: '早餐', sub: '飯店自助早餐（持房卡）'},
      {
        time: '08:30',
        desc: '各組（1–10組）集合',
        sub: '恩淩、彥廷、宣澔留下上營養課；其餘人搭車去療養院服務',
        highlight: false
      },
      {time: '09:00–10:00', desc: '營養課前活動', sub: '捷絲旅十樓（未定案，待通知）', highlight: true},
      {
        time: '10:00–11:30',
        desc: '中高齡營養實務課程',
        sub: '捷絲旅十樓，黃湘老師主課（恩淩、彥廷、宣澔）',
        highlight: true
      },
      {time: '08:30–12:00', desc: '服務活動', sub: '療養院服務（有緊急狀況通知我或少芸）'},
      {time: '12:00–13:00', desc: '午餐', sub: '捷絲旅一樓會合，發便當'},
      {time: '13:00–13:30', desc: '移動到闖關地點', sub: '步行至都會公園 A 區'},
      {time: '13:30–15:00', desc: '闖關活動', sub: '都會公園 A 區'},
      {time: '15:00–16:40', desc: '奉行福音 — 奇美博物館', sub: '台南人請帶身份證 🙏（門票大會出）'},
      {time: '16:40–17:00', desc: '回捷絲旅'},
      {time: '17:00–18:00', desc: '晚餐', sub: '捷絲旅一樓發便當'},
      {time: '17:30–18:15', desc: '舞會準備', sub: '與晚餐時間重疊，需換衣服者請把握時間', highlight: true},
      {time: '18:15–18:30', desc: '移動到十鼓一館', sub: '十鼓有燈亮著的地方'},
      {time: '18:30–20:30', desc: '舞會 🎊', sub: '十鼓一館（白雪公主主題，第二組著藏青＋黃色）', highlight: true},
      {time: '20:30–21:30', desc: '舞會撤場，回飯店'},
      {time: '21:30～', desc: '玩樂時間 🎮'},
    ],
  },
  {
    date: '第三天 6/20（六）',
    label: '第三天',
    shortDate: '6/20（六）',
    rows: [
      {time: '06:30–08:45', desc: '早餐', sub: '飯店自助'},
      {time: '08:45–09:00', desc: '退房 ／ 移動', sub: '前往十鼓二館，行李收拾好；我跟少芸收房卡（需還給杜祐萱）'},
      {time: '09:00–09:30', desc: '靈修', sub: '十鼓二館，冷靜時間'},
      {time: '09:30–11:30', desc: '自立課程', sub: '主題：求學階段選擇方向 ／ 職場韌性；惠輔 ／ 何謙主講；十鼓二館'},
      {time: '11:30–12:30', desc: '閉幕式', sub: '十鼓二館'},
      {time: '12:30–13:00', desc: '賦歸 👋'},
    ],
  },
]

const tainanCard = ['鄧恩凌', '張菀真', '黃敬倫', '吳旻軒']
</script>