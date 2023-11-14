<script setup lang="js">
import {initFlowbite} from "flowbite";
import {useActiveStore} from "~/stores/active";


const activeStore = useActiveStore();

//要刪除的活動日期時間
const delete_active_name = ref('');
const delete_active_date = ref('');
const delete_active_time = ref('');
//設置要刪除的點名表名稱
const setDeleteActive = (date, time, name) => {
  delete_active_date.value = date;
  delete_active_time.value = time;
  delete_active_name.value = name;
}
onMounted(()=>{
  activeStore.refreshActive();

  setTimeout(()=>{

    initFlowbite();
  },1000);
})
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <p class="text-black dark:text-white text-5xl text-center pt-5">活動列表</p>
      <div class="grid gap-6 mb-6 grid-cols-3 md:grid-cols-4 items-center pt-5  mx-5">


        <div>
          <select v-model="activeStore.data.search_active_month" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有時間</option>
            <option>固定時間</option>
            <option>11</option>
            <option>12</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </select>
        </div>
        <NuxtLink to="/admin/activity/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          新增</NuxtLink>
        <button @click="activeStore.refreshActive()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          刷新</button>

      </div>

      <div class="grid gap-6 mx-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        <div  v-for="(active) in activeStore.activeList" class="p-1 grid justify-items-center grid-cols-2 md:grid-cols-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <div>
            <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{active.name}}</p>
            <p v-show="!active.fixed" class="text-xl p-2 md:text-5xl font-bold tracking-tight text-blue-700 dark:text-blue-400 text-center">{{active.date}}</p>
            <p v-show="active.fixed" class="text-xl p-2 md:text-5xl font-bold tracking-tight text-blue-700 dark:text-blue-400 text-center">{{active.week}}</p>
            <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-orange-700 dark:text-orange-400 text-center">{{active.time}}~{{active.end_time}}</p>
          </div>


          <div class="inline-flex rounded-md shadow-sm" role="group">
            <NuxtLink @click="activeStore.setEditActive(active.date, active.time)" to="/admin/activity/info" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              查看
            </NuxtLink>
            <NuxtLink @click="activeStore.setEditActive(active.date, active.time)" to="/admin/activity/edit" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>
            <button @click="setDeleteActive(active.date, active.time, active.name)" data-modal-target="delete_active_define" data-modal-toggle="delete_active_define" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-red-800 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-red-600 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-red-500 dark:border-white dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              刪除
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>


  <div id="delete_active_define" data-modal-backdrop="static" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="delete_active_define">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>

          <p class="text-2xl font-normal text-gray-500 dark:text-gray-400">你確定要刪除</p>
          <p class="text-2xl font-black text-red-500">{{delete_active_name}}</p>
          <p class="mb-5 text-2xl font-normal text-gray-500 dark:text-gray-400">活動嗎?</p>

          <button @click="activeStore.remove(delete_active_date, delete_active_time)" data-modal-hide="delete_active_define" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-2xl inline-flex items-center px-5 py-2.5 text-center me-2">
            是，我確定
          </button>
          <button data-modal-hide="delete_active_define" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-2xl font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            不，取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>