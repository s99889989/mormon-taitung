<script setup lang="js">
import {useRollCallStore} from "~/stores/roll_call";
import html2canvas from 'html2canvas';
const rollCallStore = useRollCallStore();

const memberFilterList = (state) => {
  let memberList = rollCallStore.data.edit_roll_call.member_list.slice();
  memberList = memberList.filter(m => m.stake === '花蓮');
  memberList = memberList.filter(m => m.ward === '台東一');
  if (state !== '所有') {
    memberList = memberList.filter(m => state === '有到' ? m.have : !m.have);
  }
  return memberList;
}

const getVisitMemberAmount = () => {
  let sum = 0;
  rollCallStore.data.edit_roll_call.member_visit_list.forEach(v => { sum += v.amount; });
  sum += rollCallStore.data.edit_roll_call.member_list.filter(
      m => m.ward !== '台東一' && m.have
  ).length;
  return sum;
}

const getOrganizations = (organizations, have) => {
  return rollCallStore.data.edit_roll_call.member_list.filter(member => {
    if (member.stake !== '花蓮') return false;
    if (member.ward !== '台東一') return false;
    if (member.organizations !== '初級會' && member.person_type === '部分成員') return false;
    if (member.organizations !== organizations) return false;
    if (!have && member.area.length < 1) return false;
    if (have && !member.have) return false;
    if (!have && member.have) return false;
    return true;
  });
}

const getVisit = () => {
  return rollCallStore.data.edit_roll_call.member_list.filter(
      m => m.ward !== '台東一' && m.have
  );
}

const downLoad = async () => {
  const canvas = await html2canvas(document.getElementById('myDiv'));
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = "台東一支會-" + rollCallStore.data.edit_roll_call.date + '-點名表.png';
  link.click();
}

onMounted(() => {
  if (rollCallStore.data.edit_roll_call.date.length < 1) {
    useRouter().push('/admin/roll_call/list');
  }
})

// 組織列表
const orgList = ['長老定額組', '慈助會', '男青年', '女青年', '初級會', '傳教士', '非成員'];
const orgLabels = { '非成員': '非教友' };
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <div id="myDiv" class="dark:bg-black bg-white w-full pb-10">

        <!-- 標題 -->
        <p class="text-5xl font-medium text-gray-900 dark:text-white text-center pt-5 pb-3">查看點名表</p>

        <!-- 資訊區：緊湊 grid，從 md 就開始兩欄 -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 px-5 pb-4">
          <div class="flex flex-col">
            <span class="text-base text-gray-500 dark:text-gray-400">日期</span>
            <span class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ rollCallStore.data.edit_roll_call.date }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-base text-gray-500 dark:text-gray-400">點名人員</span>
            <span class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ rollCallStore.data.edit_roll_call.roll_call_man }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-base text-gray-500 dark:text-gray-400">總共點到人數</span>
            <span class="text-2xl font-semibold text-red-600 dark:text-red-400">
              {{ memberFilterList('有到').length + getVisitMemberAmount() }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-base text-gray-500 dark:text-gray-400">(一支會)有到人數</span>
            <span class="text-2xl font-semibold text-orange-600 dark:text-orange-400">
              {{ memberFilterList('有到').length }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-base text-gray-500 dark:text-gray-400">拜訪人數</span>
            <span class="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {{ getVisitMemberAmount() }}
            </span>
          </div>
        </div>

        <!-- 各組織區塊 -->
        <div v-for="org in orgList" :key="org"
             class="mx-5 mt-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">

          <div class="px-4 pt-3 pb-1">
            <p class="text-2xl text-amber-700 dark:text-amber-400 font-semibold">
              {{ orgLabels[org] ?? org }}
            </p>
            <p class="text-xl text-blue-700 dark:text-blue-400">
              有到 {{ getOrganizations(org, true).length }} 人
            </p>
          </div>

          <!-- 有到：auto-fill 用滿寬度 -->
          <div v-if="getOrganizations(org, true).length > 0"
               class="px-4 pb-2 grid gap-x-6 gap-y-1"
               style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))">
            <p v-for="member in getOrganizations(org, true)" :key="member.id"
               class="text-2xl text-gray-900 dark:text-white">
              {{ member.name }}
            </p>
          </div>

          <!-- 沒到 -->
          <div v-if="getOrganizations(org, false).length > 0" class="px-4 pb-3">
            <p class="text-base text-gray-500 dark:text-gray-400 mb-1">
              沒到 {{ getOrganizations(org, false).length }} 人
            </p>
            <div class="grid gap-x-6 gap-y-1"
                 style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))">
              <p v-for="member in getOrganizations(org, false)" :key="member.id"
                 class="text-2xl text-gray-400 dark:text-gray-500">
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- 拜訪區 -->
        <div class="mx-5 mt-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
          <p class="px-4 pt-3 pb-1 text-2xl text-fuchsia-700 dark:text-fuchsia-400 font-semibold">
            拜訪 {{ getVisitMemberAmount() }} 人
          </p>
          <div class="px-4 pb-3 grid gap-x-6 gap-y-1"
               style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
            <p v-for="member in getVisit()" :key="member.id"
               class="text-2xl text-gray-900 dark:text-white">
              {{ member.name }}
            </p>
            <div v-for="member in rollCallStore.data.edit_roll_call.member_visit_list" :key="member.name" class="flex gap-1">
              <p class="text-2xl text-gray-900 dark:text-white">{{ member.name }}</p>
              <p class="text-base text-yellow-600 dark:text-yellow-400 self-end pb-0.5">{{ member.amount }}人</p>
            </div>
          </div>
        </div>

      </div>

      <!-- 底部按鈕 -->
      <div class="grid gap-4 grid-cols-2 items-center pt-4 px-5">
        <button @click="downLoad()" type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium text-center rounded-lg text-2xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
          下載成圖片
        </button>
        <NuxtLink to="/admin/roll_call/list" type="button"
                  class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700">
          返回點名列表
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>