<script setup lang="js">
import {useMembersStore} from "~/stores/members";

const membersStore = useMembersStore();

onMounted( () => {
  if(membersStore.data.editData.id.length == 0){
    const router = useRouter()
    router.push('/admin/member/list');
  }
})
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="flex justify-center">
        <span class=" text-4xl font-medium text-gray-900 dark:text-white">查看成員</span>
      </div>

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">姓名</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.name}}</p>
          </div>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">聖職職位</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.priesthood}}</p>
          </div>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">召喚</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.calling}}</p>
          </div>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-32 text-3xl block font-medium text-gray-900 dark:text-white">支聯會</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.stake}}</p>
          </div>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">支會</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.ward}}</p>
          </div>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">組織</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.organizations}}</p>
          </div>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">地區</label>
          <div class="ps-5 flex items-center text-xl bg-gray-50 border h-12 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <p>{{membersStore.data.editData.area}}</p>
          </div>
        </div>

        <NuxtLink to="/admin/member/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          返回列表</NuxtLink>


      </div>

    </div>
  </div>
</template>

<style scoped>

</style>