<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
onMounted(() => {
  initFlowbite();
})
//滾動到底
const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
};
//滾動到頂
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>

  <nav class="fixed w-full border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
<!--    <div class="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">-->
    <div class="flex flex-row p-4">
      <NuxtLink to="/" class="basis-1/4 flex items-center">
        <img src="/logo.png" class="h-8 mr-3" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">台東一支會</span>
      </NuxtLink>

      <div class="w-full basis-1/2 flex justify-center" id="navbar-solid-bg">
        <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">

          <li>
            <NuxtLink to="/admin/activity/list" class="text-2xl block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              活動</NuxtLink>
          </li>

          <li>
            <NuxtLink to="/admin/roll_call/list" class="text-2xl block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              點名</NuxtLink>
          </li>

          <li>
            <NuxtLink to="/admin/member/list" class="text-2xl block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              成員</NuxtLink>
          </li>

          <li>
            <NuxtLink to="/admin/setting/main" class="text-2xl block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
              設定</NuxtLink>
          </li>

        </ul>
      </div>



    </div>
  </nav>
<!--  <button id="goto" @click="scrollToTop" class="go_top">TOP</button>-->
<!--  <button @click="scrollToBottom" class="go_down">Down</button>-->
</template>

<style scoped>
.go_top {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 90px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;

  transition: opacity 0.5s ease;
}
.go_down {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;

  transition: opacity 0.5s ease;
}

@media (max-width: 768px) {
  .go_top {
    right: 10px;
    bottom: 90px;
  }
  .go_down {
    right: 10px;
    bottom: 30px;
  }
}
</style>