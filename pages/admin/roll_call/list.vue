<script setup lang="ts">
import {useRollCallStore} from "~/stores/roll_call";


const rollCallStore = useRollCallStore();

const getAmount = (objectID: any) => {
  const member = rollCallStore.rollCallList[objectID];

  let amount = member.member_list.length;
  console.log('1數量: '+amount)
  member.member_visit_list2.forEach((addMember)=>{
    console.log(addMember.name)
    amount += addMember.amount;
    console.log('2數量: '+addMember.amount)
  })
  console.log('3數量: '+amount)
  return amount;
}

</script>

<template>
  <div class="dark:bg-black bg-gray-50 flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <p class="text-black dark:text-white text-5xl text-center pt-5">點名列表</p>
      <div class="grid gap-6 mb-6 grid-cols-3 md:grid-cols-4 items-center pt-5  mx-5">


        <div>
          <select v-model="rollCallStore.data.search_roll_call_month" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>選擇月份</option>
            <option value="01">1</option>
            <option value="02">2</option>
            <option value="03">3</option>
            <option value="04">4</option>
            <option value="05">5</option>
            <option value="06">6</option>
            <option value="07">7</option>
            <option value="08">8</option>
            <option value="09">9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>

        <NuxtLink to="/admin/roll_call/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          新增</NuxtLink>
        <button @click="rollCallStore.refresh()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          刷新</button>

      </div>


      <div class="grid gap-6 mx-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        <div  v-for="(member, index) in rollCallStore.rollCallList" class="p-1 md:p-5 flex sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.date}}</p>
          <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-sky-700 dark:text-sky-400 text-center">人數: {{getAmount(member.objectID)}}</p>

          <div class="inline-flex rounded-md shadow-sm" role="group">

            <button type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              查看
            </button>
            <NuxtLink to="/admin/roll_call/edit" @click="rollCallStore.getEdit(member.date)" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>
            <button @click="rollCallStore.remove(member.date, index)" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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