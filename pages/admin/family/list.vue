<script setup lang="js">

import {useFamilyStore} from "~/stores/family.js";
import {initFlowbite} from "flowbite";
import html2canvas from "html2canvas";

const familyStore = useFamilyStore();

//要刪除的點名表名稱
const delete_member = ref('');
const delete_name = ref('');
//設置要刪除的點名表名稱
const setDeleteMember = (id, name) => {
  delete_member.value = id;
  delete_name.value = name;
}

onBeforeRouteLeave(async (to, from)=>{
  localStorage.setItem("scrollY", window.scrollY+"");
})

onMounted(async ()=>{

  await refresh();

  const scrollY = localStorage.getItem("scrollY");
  if(scrollY != null){
    setTimeout(()=>{
      window.scrollTo(0, parseFloat(scrollY));
    }, 1)

  }


})
const getAge = (birthday) => {
  if(birthday === '-'){
    return "";
  }
  let age = "?";
  if(birthday.length > 0){
    const birthDate = new Date(birthday);
    const currentDate = new Date();
    age = currentDate.getFullYear() - birthDate.getFullYear();
    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  }

  return "-"+age;
}
//是否在讀取
const loading = ref(false);
const refresh = async () => {
  loading.value = true;
  await familyStore.refreshMember().then(()=>{
    initFlowbite();
    loading.value = false;
  });
}

//下載成圖片
const downLoad = async () => {

  const targetDiv = document.getElementById('myDiv');


  const canvas = await html2canvas(targetDiv);


  const imageData = canvas.toDataURL('image/png');


  const link = document.createElement('a');
  link.href = imageData;
  link.download = "部分成員名單.png";


  link.click();
}

const getMemberColor = (member) => {
  let color = 1;
  if(member.person_type === '部分成員' && member.gender === '男'){
    color = 1;
  }
  if(member.person_type === '成員' && member.gender === '男'){
    color = 2;
  }
  if(member.person_type === '部分成員' && member.gender === '女'){
    color = 3;
  }
  if(member.person_type === '成員' && member.gender === '女'){
    color = 4;
  }

  return color;
}

</script>

<template>
  <div class="dark:bg-black min-h-screen bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4 mx-5">
      <!--   標題   -->
      <p class="text-black dark:text-white text-5xl text-center pt-5">家庭名單</p>

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
        <div class="grid gap-6 mb-6 grid-cols-3 items-center pt-5">
          <div class="">
            <input v-model="familyStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
          </div>

          <select v-model="familyStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>花蓮支聯會</option>
            <option>其他支聯會</option>
            <option>所有支聯會</option>
          </select>

          <select v-model="familyStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>台東一支會</option>
            <option>其他支會</option>
            <option>所有支會</option>
          </select>

          <select v-model="familyStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有組織</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>男青年</option>
            <option>女青年</option>
            <option>初級會</option>
            <option>傳教士</option>
            <option>非成員</option>
          </select>

          <select v-model="familyStore.data.search_member_person_type" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>人員類型</option>
            <option>成員</option>
            <option>部分成員</option>
            <option>慕道友</option>
          </select>

          <select v-model="familyStore.data.search_member_positive" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>積極情況</option>
            <option>不積極</option>
            <option>積極</option>
          </select>

          <select v-model="familyStore.data.search_member_calling" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有召喚</option>
            <option>主教團</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>女青年</option>
            <option>初級會</option>
          </select>

          <div class="">
            <input v-model="familyStore.data.search_member_age" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
          </div>

<!--          <NuxtLink to="/admin/member/report" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">-->
<!--            報表</NuxtLink>-->

          <NuxtLink to="/admin/member/add" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            新增</NuxtLink>
          <button @click="refresh()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            刷新</button>
          <button @click="familyStore.fixMember()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            修復</button>
          <p class="text-xl text-black dark:text-white" >人數:{{ familyStore.familyList.length }}</p>
          <button @click="downLoad()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-2xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            下載成圖片</button>
        </div>



        <div id="myDiv" class="grid gap-6 grid-cols-1 md:grid-cols-3 pb-20">

          <div v-for="(member) in familyStore.familyList" class="p-1 md:p-5 flex justify-around sm:flex-row md:flex-col bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 items-center md:items-start">

            <div class="flex border mb-5">
              <p :class="{'color_1': getMemberColor(member) === 1, 'color_2': getMemberColor(member) === 2, 'color_3': getMemberColor(member) === 3, 'color_4': getMemberColor(member) === 4}" class="p-2 me-5 text-2xl md:text-5xl font-bold tracking-tight text-center">{{member.name}}{{getAge(member.birthday)}}</p>
              <p :class="{'color_1': getMemberColor(familyStore.getMemberNotNull(member.spouse)) === 1, 'color_2': getMemberColor(familyStore.getMemberNotNull(member.spouse)) === 2, 'color_3': getMemberColor(familyStore.getMemberNotNull(member.spouse)) === 3, 'color_4': getMemberColor(familyStore.getMemberNotNull(member.spouse)) === 4}" class="p-2 text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(member.spouse).name}}{{getAge(familyStore.getMemberNotNull(member.spouse).birthday)}}</p>

            </div>
            <div v-for="(familyC) in member.child" class="flex flex-wrap me-2">
              <div class="border">
                <div class="flex border m-2">
                  <p :class="{'color_1': getMemberColor(familyStore.getMemberNotNull(familyC)) === 1, 'color_2': getMemberColor(familyStore.getMemberNotNull(familyC)) === 2, 'color_3': getMemberColor(familyStore.getMemberNotNull(familyC)) === 3, 'color_4': getMemberColor(familyStore.getMemberNotNull(familyC)) === 4}" class="p-2 me-5 text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(familyC).name}}{{getAge(familyStore.getMemberNotNull(familyC).birthday)}}</p>
                  <p :class="{'color_1': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse)) === 1, 'color_2': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse)) === 2, 'color_3': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse)) === 3, 'color_4': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse)) === 4}" class="p-2 text-amber-100 text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse).name}}{{getAge(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyC).spouse).birthday)}}</p>

                </div>

                <div>
                  <div v-for="(familyB) in familyStore.getMemberNotNull(familyC).child" class="flex">
                    <p :class="{'color_1': getMemberColor(familyStore.getMemberNotNull(familyB)) === 1, 'color_2': getMemberColor(familyStore.getMemberNotNull(familyB)) === 2, 'color_3': getMemberColor(familyStore.getMemberNotNull(familyB)) === 3, 'color_4': getMemberColor(familyStore.getMemberNotNull(familyB)) === 4}" class="p-2 me-5 text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(familyB).name}}{{getAge(familyStore.getMemberNotNull(familyB).birthday)}}</p>
                    <p :class="{'color_1': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse)) === 1, 'color_2': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse)) === 2, 'color_3': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse)) === 3, 'color_4': getMemberColor(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse)) === 4}" class="p-2 text-amber-100 text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse).name}}{{getAge(familyStore.getMemberNotNull(familyStore.getMemberNotNull(familyB).spouse).birthday)}}</p>
                  </div>
                </div>
              </div>

            </div>



<!--            <p  v-for="(familyC) in family.father.child" class="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{familyStore.getMemberNotNull(familyC).name}}</p>-->
<!--            <p  v-for="(familyCC) in familyStore.getMemberNotNull(familyC).child" class="text-2xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">{{familyStore.getMemberNotNull(familyCC).name}}</p>-->
<!--            <p :class="{'dark:text-white': family.person_type === '部分成員', 'dark:text-blue-400': family.person_type === '成員'}" class="text-2xl md:text-5xl font-bold tracking-tight text-center">{{family.name}}</p>-->
<!--            <p :class="{'dark:text-white': familyStore.getMemberNotNull(family.spouse).person_type === '部分成員', 'dark:text-blue-400': familyStore.getMemberNotNull(family.spouse).person_type === '成員'}" class="text-2xl md:text-5xl font-bold tracking-tight text-center">{{familyStore.getMemberNotNull(family.spouse).name}}</p>-->
<!--            <p class="text-2xl md:text-3xl font-normal text-teal-700 dark:text-teal-400">{{member.person_type}}</p>-->
<!--            <p class="text-2xl md:text-3xl font-normal text-red-700 dark:text-red-400">{{member.positive}}</p>-->
<!--            <p class="text-2xl md:text-3xl font-normal text-sky-700 dark:text-sky-400">{{getAge(member.birthday)}}</p>-->
<!--            <p class="text-xl md:text-3xl font-normal text-fuchsia-700 dark:text-fuchsia-400">{{member.organizations}}</p>-->
<!--            <p class="text-xl md:text-3xl font-normal text-orange-700 dark:text-orange-400">{{member.calling}}</p>-->

          </div>

        </div>
      </div>



    </div>

  </div>

</template>

<style scoped>
.color_1{
  color: #d7dc37;
}
.color_2{
  color: #96b491;
}
.color_3{
  color: #e16619;
}
.color_4{
  color: #96b491;
}
</style>