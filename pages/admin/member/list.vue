<script setup lang="ts">

import {useMembersStore} from "~/stores/members";

const membersStore = useMembersStore();



onBeforeRouteLeave(async (to, from)=>{
  localStorage.setItem("scrollY", window.scrollY+"");
})

onMounted(async ()=>{
  const scrollY = localStorage.getItem("scrollY");
  if(scrollY != null){
    setTimeout(()=>{
      window.scrollTo(0, parseFloat(scrollY));
    }, 1)

  }
})



</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4 mx-5">
      <p class="text-black dark:text-white text-5xl text-center pt-5">人員名單</p>
      <div class="grid gap-6 mb-6 grid-cols-3 items-center pt-5">
        <div class="">
          <input v-model="membersStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
        </div>

        <select v-model="membersStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>花蓮支聯會</option>
          <option>其他支聯會</option>
          <option>無支聯會</option>
          <option>所有分類</option>
        </select>

        <select v-model="membersStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>台東一支會</option>
          <option>其他支會</option>
          <option>慕道友</option>
          <option>所有分類</option>
        </select>

        <select v-model="membersStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>所有分類</option>
          <option>長老定額組</option>
          <option>慈助會</option>
          <option>男青年</option>
          <option>女青年</option>
          <option>初級會</option>
          <option>傳教士</option>
          <option>無</option>
        </select>



        <NuxtLink to="/admin/member/add" type="button" class="text-center text-xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          新增</NuxtLink>
        <button @click="membersStore.refresh()" type="button" class="text-xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          刷新</button>
        <p class="text-xl text-black dark:text-white" >人數:{{membersStore.memberList.length}}</p>
      </div>



      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-20">

        <div  v-for="(member, index) in membersStore.memberList" class="p-1 md:p-5 flex justify-around sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <p class="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.name}}</p>
          <p class="text-2xl md:text-3xl font-normal text-sky-700 dark:text-sky-400">{{member.area}}</p>
          <p class="text-2xl p-2 md:text-3xl font-normal text-gray-700 dark:text-gray-400">{{member.priesthood}}</p>
          <p class="text-xl md:text-3xl font-normal text-fuchsia-700 dark:text-fuchsia-400">{{member.organizations}}</p>
          <p class="text-xl md:text-3xl font-normal text-orange-700 dark:text-orange-400">{{member.calling}}</p>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <NuxtLink to="/admin/member/edit" @click="membersStore.getEdit(member.id)" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>

            <button @click="membersStore.remove(member.id, member.objectID)" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              刪除
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>

</style>