<script setup lang="ts">

</script>

<template>
  <div class="dark:bg-black bg-white container-top w-full flex justify-center">
    <div class="w-full lg:w-3/4">
      <p class="text-black dark:text-white text-5xl text-center pt-5">設置</p>

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">色調模式: </label>
          <ThemeToggle/>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>

</style>