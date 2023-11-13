<script setup lang="ts">
import {useRollCallStore} from "~/stores/roll_call";

const rollCallStore = useRollCallStore();
import {useMembersStore} from "~/stores/members";

const membersStore = useMembersStore();



onMounted(()=>{

  membersStore.refreshMember();
  rollCallStore.data.member_list.length = 0;
  setTimeout(()=>{

    rollCallStore.data.member_list = membersStore.data.member_list.slice();
    rollCallStore.refreshRollCall();


  },1000);



})

const refresh = () => {
  rollCallStore.data.member_list = membersStore.data.member_list.slice();
  rollCallStore.refreshRollCall();
}

//計算所有有到人數
const getAmount = (date: string) => {
  let amount = 0;

  //從id獲取index
  const index = rollCallStore.data.roll_call_map.get(date);
  if(index != null){
    const member = rollCallStore.data.roll_call_list[index];

    amount = member.member_list.filter(member=>{
      return member.have
    }).length;

    member.member_visit_list.forEach((value)=>{
      amount += value.amount;
    })

  }

  return amount;
}
//設置要編輯的日期
const setEditDate = (date: string) => {
  rollCallStore.data.edit_roll_call_date = date;
}

</script>

<template>
  <div class="dark:bg-black bg-gray-50 flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <p class="text-black dark:text-white text-5xl text-center pt-5">點名列表</p>
      <div class="grid gap-6 mb-6 grid-cols-3 md:grid-cols-4 items-center pt-5  mx-5">


        <div>
          <select v-model="rollCallStore.data.search_roll_call_month" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有月份</option>
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
            <option>11</option>
            <option>12</option>
          </select>
        </div>

        <NuxtLink to="/admin/roll_call/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          新增</NuxtLink>
        <button @click="refresh" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          刷新</button>

      </div>


      <div class="grid gap-6 mx-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

        <div  v-for="(roll_call) in rollCallStore.rollCallList" class="p-1 md:p-5 flex sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{roll_call.date}}</p>
          <p class="text-xl p-2 md:text-5xl font-bold tracking-tight text-sky-700 dark:text-sky-400 text-center">人數: {{getAmount(roll_call.date)}}</p>

          <div class="inline-flex rounded-md shadow-sm" role="group">

            <NuxtLink @click="rollCallStore.setEditRollCall(roll_call.date)" to="/admin/roll_call/info" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              查看
            </NuxtLink>
            <NuxtLink @click="rollCallStore.setEditRollCall(roll_call.date)" to="/admin/roll_call/edit" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>
            <button @click="rollCallStore.remove(roll_call.date)" type="button" class="text-lg md:text-2xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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