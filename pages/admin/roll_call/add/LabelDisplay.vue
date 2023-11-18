<script setup lang="js">
const props = defineProps({
  title: String,
  titleWidth: Number,
  value: String,
})
</script>

<template>
  <div class="flex items-center">
    <label for="first_name" :style="{ width: props.titleWidth + 'px' }" class=" text-3xl block font-medium text-gray-900 dark:text-white">{{props.title}}</label>
    <div style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      {{props.value}}</div>
  </div>
</template>

