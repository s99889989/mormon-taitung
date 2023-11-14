<script setup lang="js">
import {useActiveStore} from "~/stores/active";

import TextAreaInput from "~/components/TextAreaInput.vue";
import {initFlowbite} from "flowbite";

const activeStore = useActiveStore();
const active = ref({
  fixed: false,
  week: '禮拜一',
  date: '',
  time: '',
  end_date: '',
  end_time: '',
  name: '',
  location: '',
  info: '',
  states: '規劃中',
})

onMounted(()=>{
   active.value = activeStore.data.edit_active

  initFlowbite();
})


//改變活動類型
const changeFixed = () => {

  const week = document.getElementById('week');
  const date = document.getElementById('date');
  const end_date = document.getElementById('end_date');
  if(week == null || date == null || end_date == null){
    return;
  }

  if(active.value.fixed+'' === 'true'){
    console.log('顯示'+active.value.fixed)
    week.classList.remove('hidden')
    date.classList.add('hidden');
    end_date.classList.add('hidden')
  }else {
    console.log('隱藏'+active.value.fixed)
    week.classList.add('hidden')
    date.classList.remove('hidden');
    end_date.classList.remove('hidden')
  }
}

</script>

<template>

  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <span class=" text-center text-4xl font-medium text-gray-900 dark:text-white">編輯活動</span>

        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-96  text-3xl font-medium text-gray-900 dark:text-white">是否為固定時間活動</label>
          <select @change="changeFixed()" v-model="active.fixed" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value=false selected>否</option>
            <option value=true >是</option>
          </select>
        </div>

        <div id="week" v-show="active.fixed" class="hidden flex items-center">
          <label for="first_name" class=" w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">禮拜幾</label>
          <select v-model="active.week" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>禮拜一</option>
            <option>禮拜二</option>
            <option>禮拜三</option>
            <option>禮拜四</option>
            <option>禮拜五</option>
            <option>禮拜六</option>
            <option>禮拜日</option>
          </select>
        </div>


        <div id="date" class="flex items-center">
          <label for="first_name" class="w-96 md:w-64  text-3xl font-medium text-gray-900 dark:text-white">預計開始日期</label>
          <input v-model="active.date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">預計開始時間</label>
          <input v-model="active.time" type="time" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div id="end_date" class="flex items-center">
          <label for="first_name" class="w-96 md:w-64  text-3xl font-medium text-gray-900 dark:text-white">預計結束日期</label>
          <input v-model="active.end_date" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">預計結束時間</label>
          <input v-model="active.end_time" type="time" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="flex items-center">
          <label for="first_name" class=" w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">狀態</label>
          <select v-model="active.states" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>規劃中</option>
            <option>尚未開始</option>
            <option>活動中</option>
            <option>結束</option>
          </select>
        </div>


        <div class="flex items-center">
          <label for="first_name" class="w-48 md:w-40 text-3xl font-medium text-gray-900 dark:text-white">活動名稱</label>
          <input v-model="active.name" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-48 md:w-40 text-3xl font-medium text-gray-900 dark:text-white">活動地點</label>
          <input v-model="active.location" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <TextAreaInput/>

        <div class="grid gap-6 grid-cols-2">
          <NuxtLink @click="activeStore.update()" to="/admin/activity/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            更新</NuxtLink>
          <NuxtLink to="/admin/activity/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            取消</NuxtLink>
        </div>
        <br/><br/><br/>
      </div>

    </div>
  </div>


</template>

<style scoped>

</style>