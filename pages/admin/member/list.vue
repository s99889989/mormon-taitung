<script setup lang="ts">

import {useMembersStore} from "~/stores/members";
import {initFlowbite} from "flowbite";

const membersStore = useMembersStore();

//要刪除的點名表名稱
const delete_member = ref('');
const delete_name = ref('');
//設置要刪除的點名表名稱
const setDeleteMember = (id: string, name: string) => {
  delete_member.value = id;
  delete_name.value = name;
}

onBeforeRouteLeave(async (to, from)=>{
  localStorage.setItem("scrollY", window.scrollY+"");
})

onMounted(async ()=>{

  await membersStore.refreshMember();

  const scrollY = localStorage.getItem("scrollY");
  if(scrollY != null){
    setTimeout(()=>{
      window.scrollTo(0, parseFloat(scrollY));
    }, 1)

  }

  initFlowbite();
})



</script>

<template>
  <div class="dark:bg-black min-h-screen bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4 mx-5">
      <p class="text-black dark:text-white text-5xl text-center pt-5">人員名單</p>
      <div class="grid gap-6 mb-6 grid-cols-3 items-center pt-5">
        <div class="">
          <input v-model="membersStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
        </div>

        <select v-model="membersStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>花蓮支聯會</option>
          <option>其他支聯會</option>
          <option>所有支聯會</option>
        </select>

        <select v-model="membersStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>台東一支會</option>
          <option>其他支會</option>
          <option>所有支會</option>
        </select>

        <select v-model="membersStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>所有組織</option>
          <option>長老定額組</option>
          <option>慈助會</option>
          <option>男青年</option>
          <option>女青年</option>
          <option>初級會</option>
          <option>傳教士</option>
          <option>慕道友</option>
        </select>



        <NuxtLink to="/admin/member/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          新增</NuxtLink>
        <button @click="membersStore.refreshMember()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          刷新</button>
        <p class="text-xl text-black dark:text-white" >人數:{{membersStore.memberList.length}}</p>
      </div>



      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-20">

        <div  v-for="(member, key, index) in membersStore.memberList" class="p-1 md:p-5 flex justify-around sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <p class="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.name}}</p>
          <p class="text-2xl md:text-3xl font-normal text-sky-700 dark:text-sky-400">{{member.area}}</p>
          <p class="text-2xl p-2 md:text-3xl font-normal text-gray-700 dark:text-gray-400">{{member.priesthood}}</p>
          <p class="text-xl md:text-3xl font-normal text-fuchsia-700 dark:text-fuchsia-400">{{member.organizations}}</p>
          <p class="text-xl md:text-3xl font-normal text-orange-700 dark:text-orange-400">{{member.calling}}</p>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <NuxtLink to="/admin/member/edit" @click="membersStore.setEditValue(member.id)" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>

            <button @click="setDeleteMember(member.id, member.name)" data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              刪除
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>

  <div id="popup-modal" data-modal-backdrop="static" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 class="mb-5 text-2xl font-normal font-black text-gray-500 dark:text-gray-400">你確定要刪除 <p class="text-2xl font-black text-red-500">{{delete_name}}</p>嗎?</h3>

          <button @click="membersStore.remove(delete_member)" data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-2xl inline-flex items-center px-5 py-2.5 text-center me-2">
            是，我確定
          </button>
          <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-2xl font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            不，取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>