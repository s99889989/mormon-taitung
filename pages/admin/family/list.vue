<script setup lang="js">
definePageMeta({ layout: 'admin' })

import { useFamilyStore } from "~/stores/family.js"
import { initFlowbite } from "flowbite"
import html2canvas from "html2canvas"
import { getAge } from "~/utils/date"

const familyStore = useFamilyStore()

const loading = ref(false)
const search = ref('')

onBeforeRouteLeave(() => {
  localStorage.setItem("scrollY", window.scrollY + "")
})

onMounted(async () => {
  await refresh()
  const scrollY = localStorage.getItem("scrollY")
  if (scrollY != null) {
    setTimeout(() => window.scrollTo(0, parseFloat(scrollY)), 1)
  }
})

const refresh = async () => {
  loading.value = true
  await familyStore.refreshMember().then(() => {
    initFlowbite()
    loading.value = false
  })
}

const downLoad = async () => {
  const canvas = await html2canvas(document.getElementById('myDiv'))
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = "家庭名單.png"
  link.click()
}

// 顏色對應
const getMemberColor = (member) => {
  if (!member || !member.id) return 'text-gray-400'
  if (member.person_type === '成員' && member.gender === '男') return 'text-green-400'
  if (member.person_type === '成員' && member.gender === '女') return 'text-green-400'
  if (member.person_type === '部分成員' && member.gender === '男') return 'text-yellow-400'
  if (member.person_type === '部分成員' && member.gender === '女') return 'text-orange-400'
  return 'text-gray-400'
}

const getAgeLabel = (birthday) => {
  if (!birthday || birthday === '-' || birthday.length < 1) return ''
  return ` (${getAge(birthday)})`
}

// 搜尋過濾
const filteredFamilyList = computed(() => {
  if (search.value.length === 0) return familyStore.familyList
  const q = search.value
  return familyStore.familyList.filter(member => {
    // 搜尋本人、配偶、子女名字
    if (member.name?.includes(q)) return true
    const spouse = familyStore.getMemberNotNull(member.spouse)
    if (spouse.name?.includes(q)) return true
    for (const childId of member.child) {
      const child = familyStore.getMemberNotNull(childId)
      if (child.name?.includes(q)) return true
      const childSpouse = familyStore.getMemberNotNull(child.spouse)
      if (childSpouse.name?.includes(q)) return true
      for (const grandId of child.child) {
        const grand = familyStore.getMemberNotNull(grandId)
        if (grand.name?.includes(q)) return true
      }
    }
    return false
  })
})
</script>

<template>
  <div class="dark:bg-black min-h-screen bg-gray-50 container-top w-full">
    <div class="w-full max-w-3xl mx-auto px-4">

      <!-- 標題 -->
      <p class="text-black dark:text-white text-4xl text-center pt-5 pb-3">家庭名單</p>

      <!-- 讀取圈圈 -->
      <div role="status" :class="{'hidden': !loading}" class="flex items-center justify-center py-20">
        <svg aria-hidden="true" class="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>

      <div :class="{'hidden': loading}">

        <!-- 顏色圖例 -->
        <div class="flex flex-wrap gap-3 mb-3 px-1">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">成員</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">部分成員(男)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-orange-400"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">部分成員(女)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
            <span class="text-sm text-gray-600 dark:text-gray-300">其他</span>
          </div>
        </div>

        <!-- 搜尋 + 工具列 -->
        <div class="flex gap-3 mb-4 items-center">
          <input v-model="search" type="text" placeholder="搜尋姓名..."
                 class="flex-1 text-base bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {{ filteredFamilyList.length }} 家
          </span>
          <button @click="downLoad()" type="button"
                  class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 whitespace-nowrap">
            下載圖片
          </button>
        </div>

        <!-- 家庭卡片列表 -->
        <div id="myDiv" class="flex flex-col gap-4 pb-20">

          <div v-for="member in filteredFamilyList" :key="member.id"
               class="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">

            <!-- 第一代：祖父母 -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3 flex-wrap">
                <!-- 本人 -->
                <span :class="getMemberColor(member)" class="text-xl font-bold">
                  {{ member.name }}{{ getAgeLabel(member.birthday) }}
                </span>

                <!-- 配偶 -->
                <template v-if="familyStore.getMemberNotNull(member.spouse).id">
                  <span class="text-gray-400 dark:text-gray-500 text-lg">✕</span>
                  <span :class="getMemberColor(familyStore.getMemberNotNull(member.spouse))" class="text-xl font-bold">
                    {{ familyStore.getMemberNotNull(member.spouse).name }}{{ getAgeLabel(familyStore.getMemberNotNull(member.spouse).birthday) }}
                  </span>
                </template>
              </div>
            </div>

            <!-- 第二代：子女 -->
            <div v-if="member.child.length > 0" class="px-4 py-2">
              <div v-for="childId in member.child" :key="childId" class="mb-2">
                <div class="flex items-center gap-2 flex-wrap pl-4 border-l-2 border-gray-300 dark:border-gray-600">

                  <!-- 子女本人 -->
                  <span :class="getMemberColor(familyStore.getMemberNotNull(childId))" class="text-lg font-semibold">
                    {{ familyStore.getMemberNotNull(childId).name }}{{ getAgeLabel(familyStore.getMemberNotNull(childId).birthday) }}
                  </span>

                  <!-- 子女配偶 -->
                  <template v-if="familyStore.getMemberNotNull(familyStore.getMemberNotNull(childId).spouse).id">
                    <span class="text-gray-400 text-base">✕</span>
                    <span :class="getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(childId).spouse))" class="text-lg font-semibold">
                      {{ familyStore.getMemberNotNull(familyStore.getMemberNotNull(childId).spouse).name }}{{ getAgeLabel(familyStore.getMemberNotNull(familyStore.getMemberNotNull(childId).spouse).birthday) }}
                    </span>
                  </template>
                </div>

                <!-- 第三代：孫子女 -->
                <div v-if="familyStore.getMemberNotNull(childId).child.length > 0"
                     class="pl-10 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                  <span v-for="grandId in familyStore.getMemberNotNull(childId).child" :key="grandId"
                        :class="getMemberColor(familyStore.getMemberNotNull(grandId))"
                        class="text-base font-medium">
                    {{ familyStore.getMemberNotNull(grandId).name }}{{ getAgeLabel(familyStore.getMemberNotNull(grandId).birthday) }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>