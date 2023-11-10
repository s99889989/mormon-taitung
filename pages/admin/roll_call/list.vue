<script setup lang="ts">
import {useRollCallStore} from "~/stores/roll_call";


const rollCallStore = useRollCallStore();

</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <div class="grid gap-6 mb-6 grid-cols-4 items-center pt-5  mx-5">


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

        <NuxtLink to="/admin/roll_call/add" type="button" class="text-center text-xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          新增</NuxtLink>
        <button @click="rollCallStore.refresh()" type="button" class="text-xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          刷新</button>

      </div>


      <div class="grid gap-6 mx-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

        <div  v-for="(member, index) in rollCallStore.rollCallList" class="p-5 flex sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
          <p class="text-2xl p-2 md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{member.date}}</p>
<!-- @click="rollCallStore.getEdit(member.date)"-->
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <NuxtLink to="/admin/roll_call/edit" @click="rollCallStore.getEdit(member.date)" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              編輯
            </NuxtLink>

            <button @click="rollCallStore.remove(member.date, index)" type="button" class="text-xl md:text-3xl px-4 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
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