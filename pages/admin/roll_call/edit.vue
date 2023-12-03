<script setup lang="js">
import {useRollCallStore} from "~/stores/roll_call";

const rollCallStore = useRollCallStore();

onMounted( async () => {

})

//拜訪人員人數計算
const getVisitMemberAmount = () => {
  let sum = 0;
  rollCallStore.data.edit_roll_call.member_visit_list.forEach(member_visit=>{
    sum += member_visit.amount;
  })

  let memberList = rollCallStore.data.edit_roll_call.member_list.slice();
  //支會
  memberList = memberList.filter(
      (member) => member.ward !== '台東一'
  );
  //有沒有到
  memberList = memberList.filter((member) =>
      member.have
  );
  sum += memberList.length;

  return sum;
}

//顯示計算用
const memberFilterList = (state) => {
  let memberList = rollCallStore.data.edit_roll_call.member_list.slice();

  //支聯會
  memberList = memberList.filter(
      (member) => member.stake === '花蓮'
  );
  //支會
  memberList = memberList.filter(
      (member) => member.ward === '台東一'
  );
  //人員類型
  memberList = memberList.filter(
      (member) => member.person_type === '成員'
  );
  //有沒有到
  if(state !== '有到+沒到'){
    memberList = memberList.filter((member) =>
        state === '有到' ? member.have : !member.have
    );
  }
  return memberList;
}

//增加未在名單內人員
const addVisit = () => {
  rollCallStore.data.edit_roll_call.member_visit_list.push({
    name: '',
    amount: 1,
  })
}
//移除未在名單內人員
const removeVisit = (idx) => {
  rollCallStore.data.edit_roll_call.member_visit_list.splice(idx, 1);
}
//搜尋顯示的人員
const searchMemberList = computed(() => {

  let displayMembers = rollCallStore.data.edit_roll_call.member_list.slice(); // 创建一个副本以确保响应性
  //名稱
  if (rollCallStore.data.search_member_name.length > 0) {
    displayMembers = displayMembers.filter((element) =>
        element.name.includes(rollCallStore.data.search_member_name)
    );
  }
  //支聯會
  if (rollCallStore.data.search_member_stake !== '所有') {
    displayMembers = displayMembers.filter(
        (element) => element.stake === rollCallStore.data.search_member_stake
    );
  }
  //支會
  if (rollCallStore.data.search_member_ward !== '所有') {
    displayMembers = displayMembers.filter(
        (element) => element.ward === rollCallStore.data.search_member_ward
    );
  }
  //組織
  if (rollCallStore.data.search_member_organizations !== '所有') {
    displayMembers = displayMembers.filter(
        (element) => element.organizations === rollCallStore.data.search_member_organizations
    );
  }

  //人員類型
  if(rollCallStore.data.search_member_person_type !== '所有'){
    displayMembers = displayMembers.filter(
        (element) => element.person_type === rollCallStore.data.search_member_person_type
    );
  }

  //積極-不積極
  if(rollCallStore.data.search_member_positive !== '所有'){
    displayMembers = displayMembers.filter(
        (element) => element.positive === rollCallStore.data.search_member_positive
    );
  }

  //是否有來
  if (rollCallStore.data.search_member_have !== '所有') {
    displayMembers = displayMembers.filter((element) =>
        rollCallStore.data.search_member_have === '有到' ? element.have : !element.have
    );
  }

  return displayMembers;
});
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <span class=" text-center text-4xl font-medium text-gray-900 dark:text-white">編輯點名表</span>

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">日期</label>
          <input v-model="rollCallStore.data.edit_roll_call.date" type="date" id="birthday" name="birthday" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">點名人員</label>
          <input v-model="rollCallStore.data.edit_roll_call.roll_call_man" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
          <!--          <p class="text-black dark:text-white text-xl">{{rollCallStore.data.edit_roll_call.roll_call_man}}</p>-->
        </div>

        <!--    人員數量計算    -->
        <div class="flex">
          <p class="text-black dark:text-white text-lg me-5">人數: </p>
          <p class="text-black dark:text-white text-lg me-5">所有: {{memberFilterList('有到+沒到').length}}</p>
          <p class="text-black dark:text-white text-lg me-5">有到: {{memberFilterList('有到').length}}</p>
          <p class="text-black dark:text-white text-lg me-5">沒到: {{memberFilterList('沒到').length}}</p>
          <p class="text-black dark:text-white text-lg">拜訪: {{getVisitMemberAmount()}}</p>
        </div>

        <!--   人員過濾條件    -->
        <div class="grid gap-6 grid-cols-2 md:grid-cols-3 items-center">
          <input v-model="rollCallStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
          <div class="flex items-center">
            <label class="flex-none w-24 text-3xl font-medium text-gray-900 dark:text-white">支聯會</label>
            <select v-model="rollCallStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>花蓮</option>
              <option>其他</option>
              <option>所有</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">支會</label>
            <select v-model="rollCallStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>台東一</option>
              <option>其他</option>
              <option>所有</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">組織</label>
            <select v-model="rollCallStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
            <select  v-model="rollCallStore.data.search_member_person_type" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>所有</option>
              <option>成員</option>
              <option>部分成員</option>
              <option>慕道友</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-30 text-3xl font-medium text-gray-900 dark:text-white">積極情況</label>
            <select v-model="rollCallStore.data.search_member_positive" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>所有</option>
              <option>不積極</option>
              <option>積極</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-30 text-3xl font-medium text-gray-900 dark:text-white">點到狀況</label>
            <select v-model="rollCallStore.data.search_member_have" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>所有</option>
              <option>有到</option>
              <option>沒到</option>
            </select>
          </div>

        </div>

        <!--   人員列表     -->
        <div class="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">

          <div v-for="(member) in searchMemberList" :class="{'dark:bg-gray-900 bg-white': member.have, 'dark:bg-gray-800 bg-white': !member.have}" class="p-5 justify-around flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 items-center md:items-start">
            <div class="flex items-center">
              <input v-model="member.have" id="default-checkbox" type="checkbox" value="" class="w-10 h-10 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <p class="text-2xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.name}}</p>
            </div>


            <p class="text-2xl p-2 md:text-3xl font-normal text-sky-700 dark:text-sky-400">{{member.area}}</p>

          </div>

        </div>


        <div class="flex items-center">
          <p class="me-5 text-black dark:text-white text-3xl">拜訪人員</p>
          <button @click="addVisit" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            增加
          </button>
        </div>

        <div class="grid gap-6 grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          <div v-for="(member, index) in rollCallStore.data.edit_roll_call.member_visit_list"  class="p-5 flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" >

            <div class="flex items-center mb-5">
              <label for="first_name" class="w-20 text-2xl block font-medium text-gray-900 dark:text-white">名稱</label>
              <input v-model="member.name" type="text" id="first_name" class="text-lg bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center mb-5">
              <label for="first_name" class="w-20 text-2xl block font-medium text-gray-900 dark:text-white">人數</label>
              <input v-model="member.amount" type="number" id="visitors" class="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>

            <button @click="removeVisit(index)" type="button" class="basis-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              刪除</button>
          </div>
        </div>

        <div class="grid gap-6 grid-cols-2">
          <NuxtLink @click="rollCallStore.update()" to="/admin/roll_call/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            編輯</NuxtLink>
          <NuxtLink to="/admin/roll_call/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            返回點名列表</NuxtLink>
        </div>
      </div>

      <br/> <br/> <br/>

    </div>
  </div>

</template>

<style scoped>

</style>