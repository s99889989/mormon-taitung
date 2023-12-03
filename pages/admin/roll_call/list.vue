<script setup lang="js">
import {useRollCallStore} from "~/stores/roll_call";

const rollCallStore = useRollCallStore();
import {useMembersStore} from "~/stores/members";
import {initFlowbite} from "flowbite";

const membersStore = useMembersStore();

//要刪除的點名表名稱
const delete_date = ref('');
//設置要刪除的點名表名稱
const setDeleteDate = (date) => {
  delete_date.value = date;
}
//是否在讀取
const loading = ref(false);
onMounted(()=>{
  loading.value = true;
  membersStore.refreshMember().then(()=>{
    rollCallStore.data.member_list.length = 0;
    rollCallStore.data.member_list = membersStore.data.member_list.slice();
    rollCallStore.refreshRollCall().then(()=>{
      initFlowbite();
      loading.value = false;
    });
  });

})
//刷新內容
const refresh = () => {
  loading.value = true;
  rollCallStore.data.member_list.length = 0;
  rollCallStore.data.member_list = membersStore.data.member_list.slice();
  rollCallStore.refreshRollCall().then(()=>{
    initFlowbite();
    loading.value = false;
  });

}

//計算所有有到人數
const getAmount = (date) => {
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

//獲取拜訪人數
const getVisit = (date) => {
  let sum = 0;

  //從id獲取index
  const index = rollCallStore.data.roll_call_map.get(date);
  if(index != null){
    const roll_call = rollCallStore.data.roll_call_list[index];

    roll_call.member_visit_list.forEach(member_visit=>{
      sum += member_visit.amount;
    })

    let memberList = roll_call.member_list.slice();
    //支會
    memberList = memberList.filter(
        (member) => member.ward !== '台東一'
    );

    //有沒有到
    memberList = memberList.filter((member) =>
        member.have
    );

    sum += memberList.length;

  }
  return sum;
}

</script>

<template>
  <div class="dark:bg-black bg-gray-50 flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <!--   標題   -->
      <p class="text-black dark:text-white text-5xl text-center pt-5">點名列表</p>

      <!--   讀取圈圈   -->
      <div role="status" :class="{'hidden': !loading}" class="flex items-center justify-center h-1/2">
        <svg aria-hidden="true" class="w-28 h-28 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>

      <!--   內容   -->
      <div :class="{'hidden': loading}">
        <div class="grid gap-6 mb-6 grid-cols-2 md:grid-cols-4 items-center pt-5  mx-5">

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">年份</label>
            <select v-model="rollCallStore.data.search_roll_call_year" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>所有</option>
              <option>2023</option>
              <option>2024</option>
            </select>
          </div>

          <div class="flex items-center">
            <label class="flex-none w-16 text-3xl font-medium text-gray-900 dark:text-white">月份</label>
            <select v-model="rollCallStore.data.search_roll_call_month" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option>所有</option>
              <option>11</option>
              <option>12</option>
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
            </select>
          </div>

          <NuxtLink to="/admin/roll_call/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            新增</NuxtLink>
          <button @click="refresh" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            刷新</button>

        </div>


        <div class="grid gap-6 mx-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

          <div  v-for="(roll_call) in rollCallStore.rollCallList" class="p-1 md:p-5 flex flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">
            <p class="text-xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{roll_call.date}}</p>
            <p class="text-xl md:text-4xl font-bold tracking-tight text-red-700 dark:text-red-400 text-center">總人數: {{getAmount(roll_call.date)}}</p>
            <p class="text-xl md:text-4xl font-bold tracking-tight text-orange-700 dark:text-orange-400 text-center">支會: {{getAmount(roll_call.date)-getVisit(roll_call.date)}}</p>
            <p class="text-xl md:text-4xl font-bold tracking-tight text-gray-700 dark:text-gray-400 text-center">拜訪: {{getVisit(roll_call.date)}}</p>
            <div class="inline-flex rounded-md shadow-sm" role="group">

              <NuxtLink @click="rollCallStore.setEditRollCall(roll_call.date)" to="/admin/roll_call/info" type="button" class="text-lg md:text-2xl px-2 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                查看
              </NuxtLink>
              <NuxtLink @click="rollCallStore.setEditRollCall(roll_call.date)" to="/admin/roll_call/edit" type="button" class="text-lg md:text-2xl px-2 py-2 font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                編輯
              </NuxtLink>
              <button @click="setDeleteDate(roll_call.date)" data-modal-target="popup-modal" data-modal-toggle="popup-modal" type="button" class="text-lg md:text-2xl px-2 py-2 font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                刪除
              </button>

            </div>

          </div>

        </div>
      </div>



    </div>

  </div>

  <div id="popup-modal" data-modal-backdrop="static" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>

          <p class="text-2xl font-normal text-gray-500 dark:text-gray-400">你確定要刪除</p>
          <p class="text-2xl font-black text-red-500">{{delete_date}}</p>
          <p class="mb-5 text-2xl font-normal text-gray-500 dark:text-gray-400">點名表嗎?</p>

          <button @click="rollCallStore.remove(delete_date)" data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-2xl inline-flex items-center px-5 py-2.5 text-center me-2">
            是，我確定
          </button>
          <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-2xl font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            不，取消</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>