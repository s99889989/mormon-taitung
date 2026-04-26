<script setup lang="js">
definePageMeta({ layout: 'admin' })

import { useRollCallStore } from "~/stores/roll_call";

const rollCallStore = useRollCallStore();
const route = useRoute();

// 判斷模式：/admin/roll_call/add 或 /admin/roll_call/edit
const isEdit = computed(() => route.path.includes('edit'));
const pageTitle = computed(() => isEdit.value ? '編輯點名表' : '新增點名表');
const submitLabel = computed(() => isEdit.value ? '儲存' : '新增');

onMounted(async () => {
  if (!isEdit.value) {
    // 新增模式：初始化空白資料
    rollCallStore.data.edit_roll_call = {
      date: new Date().toISOString().split('T')[0],
      name: '',
      roll_call_man: '',
      member_list: [],
      member_visit_list: [],
    }
    rollCallStore.data.member_list.forEach(member => {
      if (member.death !== '歿') {
        rollCallStore.data.edit_roll_call.member_list.push({
          id: member.id,
          name: member.name,
          stake: member.stake,
          ward: member.ward,
          organizations: member.organizations,
          person_type: member.person_type,
          positive: member.positive,
          area: member.area,
          have: false,
        })
      }
    })
  }
  // 編輯模式：資料已由列表頁的 setEditRollCall 設好，不需重新初始化
})

const handleSubmit = () => {
  if (isEdit.value) {
    rollCallStore.update();
  } else {
    rollCallStore.add();
  }
}

// 拜訪人員人數計算
const getVisitMemberAmount = () => {
  let sum = 0;
  rollCallStore.data.edit_roll_call.member_visit_list.forEach(v => { sum += v.amount; })
  sum += rollCallStore.data.edit_roll_call.member_list.filter(
      m => m.ward !== '台東一' && m.have
  ).length;
  return sum;
}

// 台東一有到人數
const memberFilterList = () => {
  return rollCallStore.data.edit_roll_call.member_list.filter(
      m => m.stake === '花蓮' && m.ward === '台東一' && m.have
  );
}

// 增加 / 移除拜訪人員
const addVisit = () => {
  rollCallStore.data.edit_roll_call.member_visit_list.push({ name: '', amount: 1 })
}
const removeVisit = (idx) => {
  rollCallStore.data.edit_roll_call.member_visit_list.splice(idx, 1);
}

// 篩選（不含點到狀況，避免勾選後消失）
const filteredBeforeHave = computed(() => {
  let list = rollCallStore.data.edit_roll_call.member_list.slice();

  if (!isEdit.value) {
    // 新增模式沒有 death 欄位，跳過此過濾
  } else {
    list = list.filter(e => e.death?.includes('在世'));
  }

  if (rollCallStore.data.search_member_name.length > 0) {
    list = list.filter(e => e.name.includes(rollCallStore.data.search_member_name));
  }
  if (rollCallStore.data.search_member_stake !== '所有') {
    list = list.filter(e => e.stake === rollCallStore.data.search_member_stake);
  }
  if (rollCallStore.data.search_member_ward !== '所有') {
    list = list.filter(e => e.ward === rollCallStore.data.search_member_ward);
  }
  if (rollCallStore.data.search_member_organizations !== '所有') {
    list = list.filter(e => e.organizations === rollCallStore.data.search_member_organizations);
  }
  if (rollCallStore.data.search_member_person_type !== '所有') {
    list = list.filter(e => e.person_type === rollCallStore.data.search_member_person_type);
  }
  if (rollCallStore.data.search_member_positive !== '所有') {
    list = list.filter(e => e.positive === rollCallStore.data.search_member_positive);
  }

  return list;
});

// 點到狀況：改排序而非過濾，避免勾選後人員消失
const searchMemberList = computed(() => {
  const members = filteredBeforeHave.value.slice();

  if (rollCallStore.data.search_member_have === '有到') {
    return members.filter(e => e.have);
  } else if (rollCallStore.data.search_member_have === '沒到') {
    // 沒到排前面，有到排後面（不隱藏）
    return [
      ...members.filter(e => !e.have),
      ...members.filter(e => e.have),
    ];
  }

  // 所有：有到排前面
  return [
    ...members.filter(e => e.have),
    ...members.filter(e => !e.have),
  ];
});
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <span class="text-center text-4xl font-medium text-gray-900 dark:text-white">{{ pageTitle }}</span>

        <!-- 日期 -->
        <div class="flex items-center">
          <label class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">日期</label>
          <input v-model="rollCallStore.data.edit_roll_call.date" type="date"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <!-- 點名人員 -->
        <div class="flex items-center">
          <label class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">點名人員</label>
          <input v-model="rollCallStore.data.edit_roll_call.roll_call_man" type="text"
                 class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="" required>
        </div>

        <!-- 人員數量計算 -->
        <div class="flex flex-wrap gap-x-5 gap-y-1">
          <p class="text-black dark:text-white text-lg">點到人數:</p>
          <p class="text-black dark:text-white text-lg">總共: {{ memberFilterList().length + getVisitMemberAmount() }}</p>
          <p class="text-black dark:text-white text-lg">台東一: {{ memberFilterList().length }}</p>
          <p class="text-black dark:text-white text-lg">拜訪: {{ getVisitMemberAmount() }}</p>
        </div>

        <!-- 人員過濾條件 -->
        <div class="grid gap-6 grid-cols-2 md:grid-cols-3 items-center">
          <input v-model="rollCallStore.data.search_member_name" type="text"
                 class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="搜尋姓名">

          <div class="flex items-center">
            <label class="flex-none w-24 text-3xl font-medium text-gray-900 dark:text-white">支聯會</label>
            <select v-model="rollCallStore.data.search_member_stake"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>花蓮</option>
              <option>其他</option>
              <option>所有</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">支會</label>
            <select v-model="rollCallStore.data.search_member_ward"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>台東一</option>
              <option>其他</option>
              <option>所有</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">組織</label>
            <select v-model="rollCallStore.data.search_member_organizations"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>所有</option>
              <option>長老定額組</option>
              <option>慈助會</option>
              <option>男青年</option>
              <option>女青年</option>
              <option>初級會</option>
              <option>傳教士</option>
              <option>非成員</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-30 text-3xl font-medium text-gray-900 dark:text-white">人員類型</label>
            <select v-model="rollCallStore.data.search_member_person_type"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>所有</option>
              <option>成員</option>
              <option>部分成員</option>
              <option>慕道友</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-30 text-3xl font-medium text-gray-900 dark:text-white">積極情況</label>
            <select v-model="rollCallStore.data.search_member_positive"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>所有</option>
              <option>不積極</option>
              <option>積極</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-30 text-3xl font-medium text-gray-900 dark:text-white">點到狀況</label>
            <select v-model="rollCallStore.data.search_member_have"
                    class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option>所有</option>
              <option>有到</option>
              <option>沒到</option>
            </select>
          </div>
        </div>

        <!-- 人員列表：點擊整張卡片切換狀態 -->
        <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
          <div v-for="(member) in searchMemberList" :key="member.id"
               :class="member.have
              ? 'dark:bg-gray-900 bg-gray-50 border-blue-400 dark:border-blue-500'
              : 'dark:bg-gray-800 bg-white border-gray-200 dark:border-gray-700'"
               class="p-4 flex flex-col gap-2 border-2 rounded-lg shadow cursor-pointer select-none transition-colors"
               @click="member.have = !member.have">

            <div class="flex items-center gap-2">
              <div :class="member.have ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                   class="w-4 h-4 rounded-full flex-none transition-colors"></div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">{{ member.name }}</p>
            </div>
            <p class="text-sm text-sky-600 dark:text-sky-400">{{ member.area }}</p>
          </div>
        </div>

        <!-- 拜訪人員 -->
        <div class="flex items-center">
          <p class="me-5 text-black dark:text-white text-3xl">拜訪人員</p>
          <button @click="addVisit" type="button"
                  class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700">
            增加
          </button>
        </div>

        <div class="grid gap-6 grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <div v-for="(member, index) in rollCallStore.data.edit_roll_call.member_visit_list" :key="index"
               class="p-5 flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center mb-5">
              <label class="w-20 text-2xl block font-medium text-gray-900 dark:text-white">名稱</label>
              <input v-model="member.name" type="text"
                     class="text-lg bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="" required>
            </div>
            <div class="flex items-center mb-5">
              <label class="w-20 text-2xl block font-medium text-gray-900 dark:text-white">人數</label>
              <input v-model="member.amount" type="number"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="" required>
            </div>
            <button @click="removeVisit(index)" type="button"
                    class="basis-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
              刪除
            </button>
          </div>
        </div>

        <!-- 送出 / 返回 -->
        <div class="grid gap-6 grid-cols-2">
          <NuxtLink @click="handleSubmit" to="/admin/roll_call/list" type="button"
                    class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700">
            {{ submitLabel }}
          </NuxtLink>
          <NuxtLink to="/admin/roll_call/list" type="button"
                    class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700">
            返回點名列表
          </NuxtLink>
        </div>

      </div>
      <br/><br/><br/>
    </div>
  </div>
</template>

<style scoped>
</style>