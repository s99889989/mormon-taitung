<script setup lang="ts">
import {useRollCallStore} from "~/stores/roll_call";
const rollCallStore = useRollCallStore();

onMounted( async () => {

  await rollCallStore.refreshMember();

  rollCallStore.data.editData = {
    date: '',
    roll_call_man: '',
    member_list: [],
    member_visit_list: [],
  }


})
const scrollToBottom = () => {
  // 使用 JavaScript 滚动到页面底部
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth', // 可以添加 smooth 实现平滑滚动
  });
};

const scrollToTop = () => {
  // 使用 JavaScript 滚动到页面底部
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 可以添加 smooth 实现平滑滚动
  });
};
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">日期</label>
          <input v-model="rollCallStore.data.editData.date" type="date" id="birthday" name="birthday" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">點名人員</label>
          <input v-model="rollCallStore.data.editData.roll_call_man" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>

        <p class="text-black dark:text-white text-lg">點到人數: {{rollCallStore.memberHaveList.length}}</p>

        <div class="grid gap-6 grid-cols-3 items-center">
          <input v-model="rollCallStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>

          <select v-model="rollCallStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>花蓮支聯會</option>
            <option>其他支聯會</option>
            <option>無支聯會</option>
            <option>所有分類</option>
          </select>
          <select v-model="rollCallStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>台東一支會</option>
            <option>其他支會</option>
            <option>慕道友</option>
            <option>所有分類</option>
          </select>
          <select v-model="rollCallStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有分類</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>男青年</option>
            <option>女青年</option>
            <option>初級會</option>
            <option>傳教士</option>
            <option>無</option>
          </select>
          <select v-model="rollCallStore.data.search_member_have" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有</option>
            <option >有來</option>
            <option >沒來</option>
          </select>
        </div>

        <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

          <div  v-for="(member, index) in rollCallStore.memberList" class="p-5 justify-around flex sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
            <div class="flex items-center">
              <input v-model="member.have" id="default-checkbox" type="checkbox" value="" class="w-10 h-10 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <p class="text-2xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.name}}</p>
            <p class="text-2xl p-2 md:text-3xl font-normal text-sky-700 dark:text-sky-400">{{member.area}}</p>
            <p class="text-xl p-2 md:text-3xl font-normal text-orange-700 dark:text-orange-400">{{member.calling}}</p>
          </div>

        </div>

        <div class="grid gap-6 grid-cols-2">
          <NuxtLink @click="rollCallStore.add()" to="/admin/roll_call/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            新增</NuxtLink>
          <NuxtLink to="/admin/roll_call/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            取消</NuxtLink>
        </div>
      </div>

      <br/> <br/> <br/>

    </div>
  </div>
  <button id="goto" @click="scrollToTop" class="go_top">TOP</button>
  <button @click="scrollToBottom" class="go_down">Down</button>
</template>

<style scoped>
.go_top {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 90px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;
//display: none;
  transition: opacity 0.5s ease;
}
.go_down {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;
//display: none;
  transition: opacity 0.5s ease;
}
.fadeIn {
  opacity: 1;
}
.fadeOut {
  opacity: 0;
}
</style>