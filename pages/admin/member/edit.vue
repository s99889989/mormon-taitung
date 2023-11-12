<script setup lang="ts">
import {useMembersStore} from "~/stores/members";

const membersStore = useMembersStore();

onMounted( () => {


})

</script>

<template>

  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">姓名</label>
          <input v-model="membersStore.data.editData.name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">聖職職位</label>
          <select  v-model="membersStore.data.editData.priesthood" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>無聖職職位</option>
            <option>亞倫聖職-執事</option>
            <option>亞倫聖職-教師</option>
            <option>亞倫聖職-祭司</option>
            <option>亞倫聖職-主教</option>
            <option>麥基洗德聖職-長老</option>
            <option>麥基洗德聖職-大祭司</option>
            <option>麥基洗德聖職-教長</option>
            <option>麥基洗德聖職-七十員</option>
            <option>麥基洗德聖職-使徒</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">召喚</label>
          <input v-model="membersStore.data.editData.calling" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-32 text-3xl block font-medium text-gray-900 dark:text-white">支聯會</label>
          <select  v-model="membersStore.data.editData.stake" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>花蓮支聯會</option>
            <option>其他支聯會</option>
            <option>無支聯會</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">支會</label>
          <select  v-model="membersStore.data.editData.ward" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>台東一支會</option>
            <option>其他支會</option>
            <option>慕道友</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">組織</label>
          <select  v-model="membersStore.data.editData.organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>選擇組織</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>男青年</option>
            <option>女青年</option>
            <option>初級會</option>
            <option>傳教士</option>
            <option>其他支會</option>
            <option>非成員</option>
            <option>其他</option>
          </select>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">地區</label>
          <input  v-model="membersStore.data.editData.area" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>

        <div class="grid gap-6 grid-cols-2">
          <NuxtLink to="/admin/member/list" @click="membersStore.edit()" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            編輯</NuxtLink>
          <NuxtLink to="/admin/member/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            取消</NuxtLink>
        </div>



      </div>



    </div>
  </div>
</template>

<style scoped>

</style>