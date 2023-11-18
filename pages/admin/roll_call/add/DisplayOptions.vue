<script setup lang="js">
const props = defineProps({
  title: String,
  member_list: Array,
})
</script>

<template>
  <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <p class="px-5 pt-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">{{props.title}} 人數: {{member_list.length}}</p>
    <div class="p-5 gap-3 grid grid-cols-2 md:grid-cols-3 items-center ">

      <div  v-for="(member) in member_list" class="flex">
        <p class="me-3 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
        <p class="text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>