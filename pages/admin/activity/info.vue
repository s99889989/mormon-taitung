<script setup lang="js">
import {useActiveStore} from "~/stores/active";
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

const getFixed = () => {
  if(active.value.fixed){
    return '是'
  }else {
    return '否'
  }
}


const html_area = computed(()=>{

// 匹配 <img> 标签中的内容
  const imgRegex = /<img>(.*?)<\/img>/g;

// 将匹配到的内容转换为真正的 HTML 标签
  const result = active.value.info.replace(imgRegex, (match, group) => {
    // 构造真正的 HTML 标签
    return `<img class="w-full p-5" src="${group}"/>`;
  });

// 将文本按行分割，并添加 <p> 标签
  const lines = result.split('\n').filter(line => line.trim() !== '');
  const formattedResult = lines.map(line => {

    if (line.includes('<img')) {

      return line;
    } else {

      return `<p class="text-black dark:text-white text-xl" >${line}</p>`;
    }
  }).join('');

  return formattedResult;
})



</script>

<template>

  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <span class=" text-center text-4xl font-medium text-gray-900 dark:text-white">活動訊息</span>

        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-96  text-3xl font-medium text-gray-900 dark:text-white">是否為固定時間活動</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{getFixed()}}</p>
        </div>

        <div id="week" v-show="active.fixed" class="hidden flex items-center">

          <label for="first_name" class=" w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">禮拜幾</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.week}}</p>
        </div>


        <div id="date" class="flex items-center">
          <label for="first_name" class="w-96 md:w-64  text-3xl font-medium text-gray-900 dark:text-white">預計開始日期</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.date}}</p>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">預計開始時間</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.time}}</p>
        </div>

        <div id="end_date" class="flex items-center">
          <label for="first_name" class="w-96 md:w-64  text-3xl font-medium text-gray-900 dark:text-white">預計結束日期</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.end_date}}</p>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">預計結束時間</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.end_time}}</p>
        </div>

        <div class="flex items-center">
          <label for="first_name" class=" w-96 md:w-64 text-3xl font-medium text-gray-900 dark:text-white">狀態</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.states}}</p>
        </div>

        <!--        <p class="text-gray-900 dark:text-white">{{active.date}}-{{active.time}}</p>-->
        <div class="flex items-center">
          <label for="first_name" class="w-48 md:w-40 text-3xl font-medium text-gray-900 dark:text-white">活動名稱</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.name}}</p>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-48 md:w-40 text-3xl font-medium text-gray-900 dark:text-white">活動地點</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{active.location}}</p>
        </div>

        <div v-html="html_area"></div>



        <br/><br/><br/>
      </div>

    </div>
  </div>


</template>

<style scoped>

</style>