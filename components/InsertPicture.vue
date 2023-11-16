<script setup lang="js">
import {useImageStore} from "~/stores/image.js";
import {useActiveStore} from "~/stores/active";




const activeStore = useActiveStore();
const imageStore = useImageStore();

const page = ref('up_data');
const selectPage = (page_in) => {
  page.value = page_in;
}
const hasNewClass = ref(false);
const selectImage = (image) => {
  imageStore.data.select_image_path = '<img>'+image.url+'</img>';
  // hasNewClass.value = !hasNewClass.value;
  imageStore.data.image_list.forEach(i=>{
    i.select = false;
  })

  image.select = true;

  // const clickedElement = event.target;
  // console.log('Clicked element text:', clickedElement.textContent);
  // clickedElement.classList.add('border-black border-8')

}



const insertImage = () => {
  imageStore.insertImage()
}

onMounted(()=>{
  imageStore.refreshImage();
})

</script>

<template>



  <div id="insert_picture" tabindex="-1" data-modal-backdrop="static" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            插入圖片
          </h3>
          <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="insert_picture">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>

        </div>
        <div class="text-sm font-medium text-center flex text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600">
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <a @click="selectPage('up_data')" href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                上傳</a>
            </li>
            <li class="me-2">
              <a @click="selectPage('choose')" href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                選擇</a>
            </li>
            <li class="me-2">
              <a @click="selectPage('url')" href="#" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                網址</a>
            </li>
          </ul>
        </div>
        <!-- Modal body -->
        <div v-show="page === 'up_data'" class="p-4 md:p-5 space-y-4">

          <div class="flex items-center justify-center w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
<!--                 或將圖片拖曳到這裡-->
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">點擊上傳</span></p>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (最大. 800x400px)</p>
              </div>
              <input @change="imageStore.addImage()" id="dropzone-file" type="file" class="hidden" />
            </label>
          </div>

        </div>
        <div v-show="page === 'choose'" class="p-4 md:p-5 space-y-4 overflow-y-scroll">

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 h-96">
            <div v-for="(image) in imageStore.data.image_list">
<!--              <img class="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg" alt="">-->
<!--              <img class="h-auto max-w-full rounded-lg" src="https://localhost:9100/mormon/image/active/temporary/button_default.png" alt="">-->
              <img @click="selectImage(image)" class="h-auto max-w-full rounded-lg" :class="{'border-cyan-300': image.select, 'border-4': image.select}" :src="image.url" alt="">
<!--              <p class="text-black dark:text-white text-xl" >{{image.image}}</p>-->
            </div>

          </div>

        </div>
        <div v-show="page === 'url'" class="p-4 md:p-5 space-y-4">
          <div class="px-3 py-2 h-64">
            <label for="url-path" class="block mb-2 text-xl font-medium text-gray-900 dark:text-white">圖片連結</label>
            <input v-model="imageStore.data.select_image_path" type="text" id="url-path" class="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://madustrialtd.asuscomm.com:9100/ysa/image/2023/%E7%AC%AC3%E5%9B%9E/%E7%AC%AC1%E5%A4%A9/IMG_6429.jpg" required>
<!--            <span class="text-black dark:text-gray-200">因應網頁瀏覽安全，站上只支援 https 圖片連結。</span>-->
          </div>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button @click="insertImage()" data-modal-hide="insert_picture" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">確定</button>
          <button data-modal-hide="insert_picture" type="button" class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-image{

}
</style>