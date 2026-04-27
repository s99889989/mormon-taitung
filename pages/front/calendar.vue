<script setup lang="ts">
definePageMeta({ layout: 'default' })

// ════════════════════════════════════════════════════════
//  Tab
// ════════════════════════════════════════════════════════
const activeTab = ref<'taitung' | 'hualien'>('taitung')

// ════════════════════════════════════════════════════════
//  台東一支會
// ════════════════════════════════════════════════════════
const tautungYears = ['2026', '2024']
const tautungYear = ref('2026')

const chineseMonths = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']

const tautungData: Record<string, Record<string, { activities: string[]; note?: string }>> = {
  '2024': {
    '一': { activities: ['01/06 種花趣', '01/20 支聯會聖殿日', '01/28 支聯會特別大會'] },
    '二': { activities: ['02/02 聖徒騎來', '02/17 支聯會聖殿日', '02/25 家譜探索日預演', '02/28 家譜探索日'] },
    '三': { activities: ['03/02 北區姐妹大會', '03/16 支聯會聖殿日', '03/30 復活節', '03/30 急救包＋食物儲藏'], note: '*二支會合辦' },
    '四': { activities: ['04/13 總會大會', '04/20 理財講座', '04/27 鯉魚山健行'], note: '*二支會合辦' },
    '五': { activities: ['05/04 母親節卡片製作', '05/18 支聯會聖殿日', '05/25 母親節酒精畫製作'], note: '*二支會合辦' },
    '六': { activities: ['06/01 包粽子及夏季支聯會家人家庭晚會', '06/08~09 支聯會大會', '06/15 支聯會聖殿日（女青聖殿日）'] },
    '七': { activities: ['07/06 搭火車去旅行', '07/20 支聯會聖殿日', '07/28 支會大會', '07/28 歡送蔡會長夫婦、盈君姐妹'], note: '*二支會合辦' },
    '八': { activities: ['08/03 父親節禮物製作', '08/10 父親節活動', '08/17 支聯會聖殿日'] },
    '九': { activities: ['09/07 籃球教學', '09/14 中秋節烤肉＆秋季聯會家人家庭晚會', '09/21 支聯會聖殿日'] },
    '十': { activities: ['10/03 支會傳教士返鄉活動', '10/05 萬聖節點心製作及發送', '10/12 總會大會', '10/26 手工精油皂'] },
    '十一': { activities: ['11/02 初級會音樂會', '11/09 支聯會姐妹大會（台東）', '11/23 感恩節'], note: '*二支會合辦' },
    '十二': { activities: ['12/07 薑餅屋及家譜製作', '12/14~15 支聯會大會', '12/21 支聯會聖殿日社區服務', '12/21 聖誕節'] },
  },
  '2026': {
    '一': { activities: ['1/24 各組織領袖台北開會', '1/30（五）慈助會：年節剪紙－教師/姜金玲'] },
    '二': { activities: ['寒假', '2/7 初級會手作福氣紅包袋 春聯'] },
    '三': { activities: ['3/07 全國姐妹大會', '3/21 男青年登都蘭山', '3/22 支會活動－「聖殿與家譜」家人家庭晚會', '初級會迦南拜訪長者'] },
    '四': { activities: ['4/11~12 上半年度總會大會轉播、公共事務會議', '4/25 慈助會：烘焙活動－教師/林時君', '初級會復活節活動'] },
    '五': { activities: ['5/09 母親節活動', '5/24 東一支會大會／傳道家人家庭晚會', '初級會母親節活動－渲染漸層花'] },
    '六': { activities: ['6/06~07 花蓮支聯會大會', '6/19 上半年度支聯會慈助會活動－手作香水／教師：徐玲', '初級會歡慶端午節－水果冰粽'] },
    '七': { activities: ['初級會認識先知', '慈助會（我在教會學到的事）'] },
    '八': { activities: ['8/02 慈助會主辦支會活動－爸爸節活動', '初級會「爸」氣外露 父親節親子闖關遊戲'] },
    '九': { activities: ['9/05 慈助會：料理－教師/侯簡瑞鳯', '9/25 支會活動－中秋節活動', '初級會享受幸福時光與電影有約'] },
    '十': { activities: ['10/09~10 支聯會露營活動', '10/10~11 下半年度總會大會轉播', '初級會運動、教堂清潔'] },
    '十一': { activities: ['11/21 東一主辦－感恩節活動', '11/28~29 支聯會大會', '初級會感謝有您愛地球、淨灘活動'] },
    '十二': { activities: ['12/12 下半年度支聯會慈助會活動', '12/?? 東二主辦－聖誕節活動', '初級會光照世人聖誕花圈'] },
  },
}

const tautungCurrentData = computed(() => tautungData[tautungYear.value] ?? {})

const monthColors = [
  'from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/40 dark:border-blue-700',
  'from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-900/40 dark:border-orange-700',
  'from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-900/40 dark:border-green-700',
  'from-pink-50 to-pink-100 border-pink-200 dark:from-pink-900/20 dark:to-pink-900/40 dark:border-pink-700',
  'from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-900/40 dark:border-purple-700',
  'from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-900/40 dark:border-yellow-700',
  'from-teal-50 to-teal-100 border-teal-200 dark:from-teal-900/20 dark:to-teal-900/40 dark:border-teal-700',
  'from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-900/40 dark:border-amber-700',
  'from-indigo-50 to-indigo-100 border-indigo-200 dark:from-indigo-900/20 dark:to-indigo-900/40 dark:border-indigo-700',
  'from-rose-50 to-rose-100 border-rose-200 dark:from-rose-900/20 dark:to-rose-900/40 dark:border-rose-700',
  'from-cyan-50 to-cyan-100 border-cyan-200 dark:from-cyan-900/20 dark:to-cyan-900/40 dark:border-cyan-700',
  'from-lime-50 to-lime-100 border-lime-200 dark:from-lime-900/20 dark:to-lime-900/40 dark:border-lime-700',
]

// ════════════════════════════════════════════════════════
//  花蓮支聯會
// ════════════════════════════════════════════════════════
const MAIN_CATS = [
  '國定假日', '國定假日與補假', '總會', '總會大會', '全國性活動',
  '支聯會聖殿日', '支聯會活動', '支聯會議會', '領導人會議', '訓練',
  '高級諮議會議', '主教團會議', '支聯會主教議會', 'CCM',
  '支聯會傳道議會', '財務稽核',
  '花蓮一', '花蓮二', '花蓮三', '玉里', '台東一', '台東二', '台東三',
]

const CAT_COLORS: Record<string, string> = {
  '國定假日': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  '國定假日與補假': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  '總會': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '總會大會': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  '全國性活動': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  '支聯會聖殿日': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  '支聯會活動': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  '支聯會議會': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  '領導人會議': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  '訓練': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  '高級諮議會議': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  '主教團會議': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  '支聯會主教議會': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'CCM': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  '支聯會傳道議會': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  '財務稽核': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  '花蓮一': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '花蓮二': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '花蓮三': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '玉里': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  '台東一': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  '台東二': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  '台東三': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  '其他': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

type YearData = Record<string, string[]>
const hualienRawData: Record<string, YearData> = {
  '2018': {
    '國定假日與補假': ['12/30-1/1 元旦連假', '2/15-2/20 春節連假', '3/31 補上班', '4/4-4/8 連假', '', '6/16-18 連假', '', '', '9/22-24 連假', '', '', '12/29-1/1 連假、12/22 補上班'],
    '總會大會': ['', '', '', '7/8 總會大會轉播', '19 聖職領導人大會', '9-10 支聯會大會', '', '25 聖職大會（花蓮）', '', '13-14 總會大會', '10-11 支聯會大會', ''],
    '北區各支聯會活動': ['', '', '24 公共事務研習', '5-7 北區單成大會', '26 公共事務頒獎', '', '12-14 青年大會', '', '', '25-27 北區年輕單成大會', '', ''],
    '支聯會聖殿日': ['20', '17', '17', '21', '19', '16', '21', '18', '15', '20', '17', '15'],
    '支聯會活動': ['27 慈助會年度活動（台東玉里）', '224 全國聖徒盃籃球邀請賽、228 運動會', '10 慈助會年度活動（花蓮一二三）', '緊急應變暨72小時急救包', '26 慈助會會長團訓練、5月中旬家譜展', '', '', '25 籃球聖徒錦標賽（花蓮主辦）', '', '籃球聖徒錦標賽（台東）', '25 初級會聖餐演出、29 感恩節', ''],
    '支聯會議會': ['', '', '', '28', '', '', '', '', '', '27', '', ''],
    '訓練': ['13 支分會會長團及主教團會議', '', '', '14 自立大會', '12 支分會會長團及主教團會議', '', '', '4 支分會會長團及主教團會議', '', '', '', '8 支分會會長團及主教團會議'],
    'CCM': ['23 CCM 會議', '區域訓練會議 2/10', '12 CCM 會議', '', '', '', '9 CCM 會議', '', '', '1 CCM 會議', '', ''],
    '財務稽核': ['財務稽核訓練', '財務稽核', '', '', '', '', '15、22 財務稽核訓練', '財務稽核', '', '', '', ''],
    '高級諮議會議': ['每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50'],
  },
  '2019': {
    '國定假日與補假': ['12/29-1/1 元旦連假、1/19 補班', '2/2-2/10 春節連假、2/23 補班', '', '4/4-4/7 連假', '5/1 勞動節', '6/7-9 端午連假', '', '', '9/13-15 中秋連假', '10/10-13 國慶連假、10/5 補班', '', '12/29-1/1 連假、12/22 補上班'],
    '總會大會': ['', '228 Meurs 會長主領爐邊聚會＠台東', '', '13-14 總會大會轉播', '25-26 支聯會大會', '6/9 關長老與支聯會會長團會議', '', '3 聖職大會暨領導人會議（玉里）', '', '12-13 總會大會、26-27 支聯會大會', '', ''],
    '北區各支聯會活動': ['', '24 公共事務會議', '', '4-6 北區單成大會', '', '22 北區姊妹大會', '8-13 FSY、18-20 Mini MTC', '25-27 北區年輕單成大會', '', '', '', ''],
    '支聯會聖殿日': ['19', '16', '16', '20', '18', '15', '20', '17', '14', '19', '16', '21'],
    '支聯會活動': ['', '228 運動會', '', '', '', '', '', '', '', '', '初級會聖餐演出、感恩節', ''],
    '支聯會議會': ['', '', '', '', '25', '', '', '', '', '26', '', ''],
    '訓練': ['12 主教團暨男女青年會長團訓練', '', '財務稽核訓練（3/8 台東、3/9 花蓮）', '', '25 支分會會長團及主教團會議', '', '20 支分會會長團及主教團會議', '', '', '26 支分會會長團及主教團會議', '', ''],
    'CCM': ['26 CCM 會議', '', '', '', '4 CCM 會議', '22 台北傳道部家庭晚餐會議', '20 台北傳道部家庭晚餐會議', '17 CCM 會議', '', '', '2 CCM 會議', '21 台北傳道部家庭晚餐會議'],
    '財務稽核': ['14 稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', '', '14 稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', ''],
    '高級諮議會議': ['每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50', '每月第二、四週日 12:15~12:50'],
  },
  '2020': {
    '國定假日與補假': ['1/23-1/29 春節連假', '228~3/1 連假', '', '4/2-4/5 連假', '5/1~5/3 勞動節連假', '6/25-28 端午連假', '', '', '', '10/1-4 中秋連假、10/9-11 國慶連假、10/5 補班', '', ''],
    '支聯會聖殿日': ['18', '15', '21', '18', '16', '20', '18', '15', '19', '17', '21', '19'],
    '支聯會活動': ['', '228 爐邊聚會、229 運動會', '', '', '', '6、7 支聯會大會', '', '1 聖職領導人會議', '', '31、1 支聯會大會', '', ''],
    '支聯會議會': ['', '', '', '', '25', '', '', '', '', '26', '', ''],
    '訓練': ['12 主教團暨男女青年會長團訓練', '', '財務稽核訓練（台東/花蓮）', '', '25 支分會會長團及主教團會議', '', '20 支分會會長團及主教團會議', '', '', '26 支分會會長團及主教團會議', '', ''],
    'CCM': ['', '8 CCM 會議', '7 台北傳道部家庭晚餐會議', '25 CCM 會議', '', '', '25 台北傳道部家庭晚餐會議', '15 CCM 會議', '', '24 CCM 會議', '2 CCM 會議', '12 台北傳道部家庭晚餐會議'],
    '財務稽核': ['12 稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', '', '14 稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', ''],
    '高級諮議會議': ['每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日'],
  },
  '2021': {
    '國定假日與補假': ['2/10-2/16 春節連假', '2/27~3/1 連假', '', '4/2-4/5 連假', '5/1~5/3 勞動節連假', '6/25-28 端午連假', '', '', '', '10/1-4 中秋連假、10/9-11 國慶連假', '', ''],
    '總會大會': ['', '2/6 亞洲區域領導人訓練會議', '', '11-12 總會大會轉播', '5/15 亞洲區域領導人訓練會議', '', '', '', '', '10-11 總會大會轉播', '', ''],
    '支聯會聖殿日': ['16', '13', '20', '17', '15', '19', '17', '21', '18', '16', '20', '18'],
    '支聯會活動': ['', '227 運動會＠玉里', '', '', '', '5、6 支聯會大會', '', '', '', '30、31 支聯會大會', '', ''],
    '支聯會議會': ['', '', '', '', '2', '', '4 支聯會輔助組織會議', '', '', '16 支聯會議會暨成年領導人會議', '', ''],
    '訓練': ['9 高級諮議/慈助會會長團訓練＠玉里', '', '6 聖職領導人會議（玉里）', '', '2 支分會會長團及主教團會議', '', '18 愛分享與邀請訓練（台東地區）', '29 支分會會長團及主教團會議', '', '23 支分會會長團及主教團會議', '', ''],
    'CCM': ['', '20 CCM 會議', '6 台北傳道部家庭晚餐會議', '24 CCM 會議', '', '', '24 台北傳道部家庭晚餐會議', '28 CCM 會議', '', '22 CCM 會議', '', '13 台北傳道部家庭晚餐會議'],
    '財務稽核': ['16 財務訓練暨稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', '', '14 稽核計畫會議', '', '15 稽核審查會議', '30 稽核結束及評定會議', '', ''],
    '高級諮議會議': ['每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日', '每月第二、四週日'],
    '台東三': ['', '', '', '', '', '20 特別支會大會', '', '', '', '', '', ''],
  },
  '2022': {
    '國定假日': ['', '1/29-2/6 春節連假', '26-28 228 連假', '', '2-5 清明連假、4/30-5/2 勞動節連假', '', '3-5 端午連假', '', '', '9-11 中秋連假', '8-10 國慶連假', ''],
    '總會大會': ['', '', '', '', '9-10 總會大會轉播', '', '', '', '', '', '8-9 總會大會轉播', ''],
    '全國性活動': ['', '', '', '26 北區姊妹大會', '21-23 年輕單成大會', '', '2-4 年輕單成大會', '11-16 FSY、21-23 北區 Mini MTC', '18-20 年輕單成大會', '9-10 北區單成大會', '6-8 年輕單成大會', ''],
    '支聯會活動': ['', '26-27 聖徒騎來、2/26 運動會', '', '', '', '7-8 花蓮支聯會大會', '', '', '（男）女青年露營', '', '', ''],
    '支聯會議會': ['', '', '20', '', '', '22', '', '', '21', '', '', '20'],
    '領導人會議': ['', '8-9 亞洲區域領導人訓練會議', '', '5 聖職領導人會議＠玉里', '', '', '', '', '', '', '', '7 成年領導人委員會'],
    '主教團會議': ['', '', '13', '', '', '1', '', '', '14', '', '23', ''],
    'CCM': ['', '', '12 CCM 會議', '', '30 CCM 會議', '', '', '', '13 CCM 會議', '', '22 CCM 會議', ''],
    '財務稽核': ['', '15 財務訓練暨稽核計畫會議', '', '13 稽核審查會議', '30 稽核結束及評定會議', '', '', '16 稽核計畫會議', '', '17 稽核審查會議', '30 稽核結束及評定會議', ''],
    '高級諮議會議': ['', '3', '6', '6', '10', '1', '5', '3', '7', '4', '2', '6'],
  },
  '2023': {
    '國定假日': ['', '1/20-1/29 春節連假（1/7 補班）', '25-28 228 連假（2/4、18 補班）', '3/25 補班', '1-5 清明連假、4/29-5/1 勞動節連假', '', '22-25 端午連假（6/17 補班）', '', '', '29-10/1 中秋連假（9/23 補班）', '7-10 國慶連假', ''],
    '總會大會': ['', '', '', '', '15-16 總會大會轉播', '', '', '', '', '', '7-8 總會大會轉播', ''],
    '全國性活動': ['', '', '', '4 北區姊妹大會、16-18 1st 年輕單成大會', '', '20 神的羔羊音樂劇', '22-24 2nd 年輕單成大會、北區單成大會', '13-15 北區青年大會、20-22 北區 Mini MTC', '18-19 北區男女青年學習營', '', '', '2-4 3rd 年輕單成大會'],
    '支聯會聖殿日': ['', '', '', '', '', '20', '', '', '', '', '', ''],
    '支聯會活動': ['', '', '27-28 支聯會露營活動（羅山）', '', '', '', '3-4 花蓮支聯會大會', '男女青優美之夜', '男女青露營活動', '', '14 家庭探索日（花蓮）', ''],
    '支聯會議會': ['', '', '19', '', '', '28', '', '', '27', '', '', '26'],
    '領導人會議': ['', '', '25 亞洲區域領導人訓練', '', '', '13 聖職領導人會議', '', '', '', '', '', ''],
    '主教團會議': ['', '', '12', '', '30', '', '', '', '', '24', '', '19'],
    'CCM': ['', '', '11 CCM 會議', '19 台北傳道部家庭會議', '29 CCM 會議', '', '', '', '', '16 CCM 會議', '', '11 CCM 會議'],
    '財務稽核': ['', '14 財務暨稽核訓練會議', '', '4 稽核審查會議', '', '', '', '15 稽核計畫會議', '', '16 稽核審查會議', '30 稽核結束及評定會議', ''],
    '高級諮議會議': ['', '8', '5', '5', '9', '7', '4', '2', '6', '3', '1', '5'],
  },
  '2024': {
    '國定假日': ['', '12/30-1/1 元旦', '2/8-2/14 春節（2/17 補班）、2/28 228 紀念日', '', '4/4-4/7 清明連假', '5/1 五一勞動節', '6/8-6/10 端午連假', '', '', '9/17 中秋節', '10/10 國慶日', ''],
    '總會': ['', '28 全球青少年活動', '4 全球年輕成人祈禱會、29-3/2 尋根科技家譜大會', '', '13-14 總會大會轉播', '5 全球年輕成人祈禱會', '', '', '', '', '12-13 總會大會轉播、27 全球青少年活動', '3 全球年輕成人祈禱會'],
    '全國性活動': ['', '27 亞洲區域指導會議', '', '2 北區姊妹大會、30 神的羔羊音樂劇（台中）', '4-6 1st 年輕單成大會', '', '', '8-13 FSY、18-20 北區 Mini MTC、26-27 2nd 年輕單成大會', '10 北區青少年活動（運動日）', '', '10-12 3rd 年輕單成大會', ''],
    '支聯會聖殿日': ['', '20（11:00）', '17（11:00）', '16（11:00）', '', '18（11:00）', '15（11:00）', '20（11:00）', '17（11:00）', '21（11:00）', '', ''],
    '支聯會活動': ['', '', '2-3 聖徒騎來、28 家庭探索日（台東）', '30 支聯會慈助會週年慶', '20 理財講座（台東）、27 理財講座（花蓮）', '', '8 Mini FSY、8-9 花蓮支聯會大會', '', '', '', '', ''],
    '支聯會議會': ['', '21', '', '24', '', '', '23', '21', '', '22', '', '17'],
    '支聯會主教議會': ['', '', '', '30', '', '26', '', '', '', '8', '', '10'],
    '支聯會傳道議會': ['', '7', '4', '3', '7', '5', '2', '7', '4', '1', '6', '10'],
    '高級諮議會議': ['', '7', '4', '3', '7', '5', '2', '7', '4', '1', '6', '17'],
    'CCM': ['', '', '', '23（原3/16）', '', '25（原4/27）', '', '', '31', '', '26', ''],
    '花蓮一': ['', '', '18 高級諮議拜訪', '', '21 高級諮議拜訪', '', '', '', '11 高級諮議拜訪', '', '20 高級諮議拜訪', '10 支會大會'],
  },
  '2025': {
    '國定假日': ['', '1/1 元旦、1/25-2/2 春節', '2/17 補班、2/28-3/2 228 連假', '', '4/3-4/6 清明連假', '5/1 五一勞動節、5/30-6/1 端午連假', '', '', '', '', '10/4-10/6 中秋連假、10/10-10/12 國慶連假', ''],
    '總會': ['', '5 全球青少年活動、23 福音進修班年度訓練轉播', '2 全球年輕成人祈禱會、15 兒童朋友對朋友活動', '6 聖殿和家譜教導、6-8 尋根科技家譜大會、16 全球慈助會祈禱會', '12-13 總會大會轉播', '4 全球年輕成人祈禱會', '10 男青年組織150週年慶祝活動', '', '7 青少年音樂節', '6 兒童朋友對朋友活動', '11-12 總會大會轉播、26 全球青少年活動', '2 全球年輕成人祈禱會'],
    '全國性活動': ['', '', '', '8 北區姊妹大會、27-29 1st 年輕單成大會、28-29 神的羔羊音樂劇', '3-6 單成大會（36+）', '18 點亮家譜光明燈', '', '2-5 北區青年大會、17-19 2nd 年輕單成大會', '10 北區青少年活動（運動日）', '', '9-11 3rd 年輕單成大會、24-26 單成大會（36+）', '8-9 溫暖人間頒獎'],
    '支聯會聖殿日': ['', '18（11:00）', '15（11:00）', '15（11:00）', '', '17（11:00）', '21（11:00）', '19（11:00）', '16（11:00）', '6（11:30）', '4（11:30）', '1（11:30）'],
    '支聯會活動': ['', '11 澄聲合唱團演出（花蓮）', '27-28 郝安迪弟兄身心健康課程', '', '', '', '7-8 花蓮支聯會大會', '', '', '', '10-11 支聯會露營', '1-2 支聯會大會'],
    '領導人會議': ['', '', '', '1 區域領導人', '', '', '', '', '', '', '', ''],
    '支聯會議會': ['', '12', '', '16', '', '', '15', '13', '', '14', '', '16'],
    '支聯會主教議會': ['', '19', '', '', '', '25', '', '', '31', '', '26', ''],
    '支聯會傳道議會': ['', '19', '9', '2', '6', '4', '1', '6', '3', '7', '5', '9'],
    '高級諮議會議': ['', '12', '9', '16', '6', '4', '1', '13', '3', '14', '5', '16'],
    'CCM': ['', '18', '', '', '', '3、15', '', '', '30', '', '25', ''],
    '台東一': ['', '', '', '', '', '', '22 支會大會', '', '', '', '', ''],
    '台東二': ['', '', '', '', '', '', '', '', '', '28 支會大會', '', ''],
    '花蓮一': ['', '', '', '', '', '', '', '', '', '', '19 支會大會', ''],
    '花蓮二': ['', '', '', '9 支會大會', '', '', '', '', '', '', '', ''],
    '玉里': ['', '', '', '', '', '25 分會大會', '', '', '', '', '', ''],
  },
  '2026': {
    '國定假日': ['', '1/1 元旦', '2/14-2/22 春節、2/27-3/1 228 連假', '', '4/3-4/6 清明連假', '5/1-5/3 勞動節連假', '6/19-6/21 端午連假', '', '', '9/25-9/28 中秋連假', '10/9-10/11 國慶連假、10/24-10/26 光復節連假', '12/25-12/27 行憲紀念日連假'],
    '總會': ['', '', '', '', '11-12 總會大會轉播', '', '', '', '', '', '10-11 總會大會轉播', ''],
    '全國性活動': ['', '', '', '7 台灣姊妹大會、28 青少年和家長的 FSY 祈禱會', '', '', '18-20 全國年輕單成大會', '13-18 FSY、25 FSY 回娘家', '15 點亮家譜光明燈暨科技尋根、20-22 Mini MTC、27-29 特別全國單成大會（18-23歲）', '', '8-10 全國年輕單成大會、北區單成大會', '28 青少年音樂季'],
    '支聯會聖殿日': ['', '3（11:30）', '7（11:30）', '7（11:30）', '4（11:30）', '2（11:30）', '6（11:30）', '4（11:30）', '1（11:30）', '5（11:30）', '3（11:30）', '7（11:30）'],
    '支聯會活動': ['', '29-31 跨支聯會青少年露營', '', '', '', '', '6-7 花蓮支聯會大會', '', '', '', '9-10 支聯會露營', '28-29 支聯會大會'],
    '領導人會議': ['', '24 區域領導人會議', '', '14 領導人指示會議', '', '', '', '', '', '', '', ''],
    '支聯會議會': ['', '18', '', '8', '', '17', '', '12', '', '13', '', '8'],
    '支聯會主教議會': ['', '', '8', '', '', '10', '', '', '30', '', '25', ''],
    '支聯會傳道議會': ['', '4', '1', '1', '12', '3', '14', '5', '2', '6', '4', '1'],
    '高級諮議會議': ['', '18', '1', '8', '12', '17', '14', '12', '2', '13', '4', '8'],
    'CCM': ['', '', '7', '', '', '9', '', '', '29', '', '24', ''],
    '財務稽核': ['', '10 財務政策訓練暨稽核計畫會議', '', '8 稽核審查會議', '5 稽核結束和評定會議', '', '', '11 稽核計畫會議', '', '6 稽核審查會議', '4 稽核結束和評定會議', ''],
    '台東一': ['', '', '', '', '', '24 支會大會', '', '', '', '', '', ''],
    '台東二': ['', '', '', '', '', '', '', '', '', '27 支會大會', '', ''],
    '花蓮一': ['', '', '', '', '', '', '', '', '', '', '25 支會大會', ''],
    '花蓮二': ['', '', '', '8 支會大會', '', '', '', '', '', '', '', ''],
    '玉里': ['', '', '', '', '26 分會大會', '', '', '', '', '', '', ''],
  },
}

const SKIP_PREFIXES = ['註：', '備註', '2.', '聚會時間', '8:30']
function isValidCat(cat: string) {
  return !SKIP_PREFIXES.some(p => cat.startsWith(p)) && cat.length <= 20
}

const hualienYears = Object.keys(hualienRawData).sort((a, b) => Number(b) - Number(a))
const hualienYear = ref('2026')
const selectedMonth = ref<number | null>(null)

const hualienCategories = computed(() => {
  const catSet = new Set(Object.keys(hualienRawData[hualienYear.value] ?? {}).filter(isValidCat))
  const ordered = MAIN_CATS.filter(c => catSet.has(c))
  const rest = [...catSet].filter(c => !MAIN_CATS.includes(c))
  return [...ordered, ...rest]
})

function catColor(cat: string): string {
  for (const key of Object.keys(CAT_COLORS)) {
    if (cat === key || cat.startsWith(key)) return CAT_COLORS[key]
  }
  return CAT_COLORS['其他']
}

const MONTHS_LABEL = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const monthCatItems = computed(() => {
  if (selectedMonth.value === null) return []
  const m = selectedMonth.value
  const data = hualienRawData[hualienYear.value] ?? {}
  return hualienCategories.value
      .map(cat => ({ cat, text: (data[cat]?.[m] ?? '').trim() }))
      .filter(item => item.text)
})
</script>

<template>
  <div class="min-h-screen pb-20 dark:bg-gray-900 transition-colors">

    <!-- 頁首 -->
    <div class="pt-20 pb-4 px-4 text-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">行事曆</h1>
    </div>

    <!-- Tab 切換 -->
    <div class="flex justify-center mb-6 px-4">
      <div class="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-1 gap-1">
        <button
            @click="activeTab = 'taitung'"
            :class="[
            'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'taitung'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
          ]"
        >台東一支會</button>
        <button
            @click="activeTab = 'hualien'"
            :class="[
            'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'hualien'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
          ]"
        >花蓮支聯會</button>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         台東一支會 Tab
    ══════════════════════════════════════ -->
    <div v-if="activeTab === 'taitung'">
      <div class="flex justify-center gap-3 mb-8 px-4">
        <button
            v-for="year in tautungYears"
            :key="year"
            @click="tautungYear = year"
            :class="[
            'px-6 py-2 rounded-full text-sm font-semibold border transition-all',
            tautungYear === year
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400',
          ]"
        >{{ year }} 年</button>
      </div>

      <div class="max-w-screen-lg mx-auto px-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <div
            v-for="(month, idx) in chineseMonths"
            :key="month"
            :class="['rounded-2xl border bg-gradient-to-br p-4 shadow-sm', monthColors[idx]]"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl font-bold text-gray-700 dark:text-gray-200">{{ month }}月</span>
            <span
                v-if="tautungCurrentData[month]?.note"
                class="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-700"
            >{{ tautungCurrentData[month].note }}</span>
          </div>
          <ul v-if="tautungCurrentData[month]?.activities?.length" class="space-y-1.5">
            <li
                v-for="(act, i) in tautungCurrentData[month].activities"
                :key="i"
                class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-none"></span>
              <span>{{ act }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic">（待確認）</p>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         花蓮支聯會 Tab
    ══════════════════════════════════════ -->
    <div v-if="activeTab === 'hualien'">
      <!-- 年份 -->
      <div class="flex flex-wrap justify-center gap-2 mb-5 px-4">
        <button
            v-for="year in hualienYears"
            :key="year"
            @click="hualienYear = year; selectedMonth = null"
            :class="[
            'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all',
            hualienYear === year
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400',
          ]"
        >{{ year }}</button>
      </div>

      <div class="max-w-screen-xl mx-auto px-4">
        <!-- 月份快速選 -->
        <div class="flex flex-wrap gap-2 mb-5 justify-center">
          <button
              v-for="(m, idx) in MONTHS_LABEL"
              :key="m"
              @click="selectedMonth = selectedMonth === idx ? null : idx"
              :class="[
              'px-3 py-1 rounded-full text-xs font-medium border transition-all',
              selectedMonth === idx
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400',
            ]"
          >{{ m }}</button>
        </div>

        <!-- 月份面板 -->
        <div
            v-if="selectedMonth !== null"
            class="mb-5 rounded-2xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-5"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-blue-700 dark:text-blue-300">
              {{ hualienYear }} 年 {{ MONTHS_LABEL[selectedMonth] }}
            </h2>
            <button @click="selectedMonth = null" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕ 關閉</button>
          </div>
          <div v-if="monthCatItems.length" class="space-y-2">
            <div v-for="item in monthCatItems" :key="item.cat" class="flex gap-3 items-start">
              <span :class="['flex-none text-xs px-2 py-0.5 rounded-full font-medium mt-0.5', catColor(item.cat)]">{{ item.cat }}</span>
              <span class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ item.text }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 italic">本月無資料</p>
        </div>

        <!-- 表格 -->
        <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table class="w-full text-xs min-w-[900px]">
            <thead>
            <tr class="bg-gray-100 dark:bg-gray-800">
              <th class="sticky left-0 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 w-28 z-10">類別</th>
              <th
                  v-for="(m, idx) in MONTHS_LABEL"
                  :key="m"
                  @click="selectedMonth = selectedMonth === idx ? null : idx"
                  :class="[
                    'px-2 py-2 text-center font-semibold cursor-pointer transition-colors w-[7%]',
                    selectedMonth === idx
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
                  ]"
              >{{ m }}</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(cat, rowIdx) in hualienCategories"
                :key="cat"
                :class="rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'"
            >
              <td
                  class="sticky left-0 px-3 py-2 z-10"
                  :class="rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'"
              >
                <span :class="['inline-block text-xs px-1.5 py-0.5 rounded-full font-medium leading-snug', catColor(cat)]">{{ cat }}</span>
              </td>
              <td
                  v-for="(m, mIdx) in MONTHS_LABEL"
                  :key="m"
                  :class="[
                    'px-2 py-2 align-top text-gray-700 dark:text-gray-300 whitespace-pre-line leading-snug',
                    selectedMonth === mIdx ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                  ]"
              >{{ (hualienRawData[hualienYear]?.[cat]?.[mIdx] ?? '').trim() }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>