<script setup lang="js">
import {useRollCallStore} from "~/stores/roll_call";
import html2canvas from 'html2canvas';
import DisplayOptions from "~/pages/admin/roll_call/add/DisplayOptions.vue";
import LabelDisplay from "~/pages/admin/roll_call/add/LabelDisplay.vue";
const rollCallStore = useRollCallStore();

//顯示計算用(本支會)
const memberFilterList = (state) => {
  let memberList = rollCallStore.data.edit_roll_call.member_list.slice();

  //支聯會
  memberList = memberList.filter(
      (member) => member.stake === '花蓮支聯會'
  );
  //支會
  memberList = memberList.filter(
      (member) => member.ward === '台東一支會'
  );
  //有沒有到
  if(state !== '有到+沒到'){
    memberList = memberList.filter((member) =>
        state === '有到' ? member.have : !member.have
    );
  }
  return memberList;
}
//拜訪人員人數計算
const getVisitMemberAmount = () => {
  let sum = 0;
  rollCallStore.data.edit_roll_call.member_visit_list.forEach(member_visit=>{
    sum += member_visit.amount;
  })

  let memberList = rollCallStore.data.edit_roll_call.member_list.slice();
  //支會
  memberList = memberList.filter(
      (member) => member.ward !== '台東一支會'
  );
  //有沒有到
  memberList = memberList.filter((member) =>
      member.have
  );
  sum += memberList.length;
  return sum;
}



//獲取本支會分類人員
const getOrganizations = (organizations, be) => {
  let memberList = rollCallStore.data.edit_roll_call.member_list;

  memberList = memberList.filter(member => {

    let b = true;
    if(member.stake !== '花蓮支聯會'){
      b = false;
    }
    if(member.ward !== '台東一支會'){
      b = false;
    }
    if(member.organizations !== organizations){
      b = false;
    }

    if ((be && !member.have) || (!be && member.have)) {
      b = false;
    }

    // if(be){
    //   if(!member.have){
    //     b = false;
    //   }
    // }else {
    //   if(member.have){
    //     b = false;
    //   }
    // }


    return b;
  })

  return memberList;
}
//獲取不是一支會的名單成員
const getVisit = () => {
  let memberList = rollCallStore.data.edit_roll_call.member_list;

  memberList = memberList.filter(member => {

    let b = true;

    if(member.ward === '台東一支會'){
      b = false;
    }

    if(!member.have){
      b = false;
    }

    return b;
  })

  return memberList;
}


//下載成圖片
const downLoad = async () => {

  const targetDiv = document.getElementById('myDiv');


  const canvas = await html2canvas(targetDiv);


  const imageData = canvas.toDataURL('image/png');


  const link = document.createElement('a');
  link.href = imageData;
  link.download = "台東一支會-"+rollCallStore.data.edit_roll_call.date+'-點名表.png';


  link.click();
}

onMounted(()=>{


  if(rollCallStore.data.edit_roll_call.date.length < 1){
    const router = useRouter()
    router.push('/admin/roll_call/list');
  }

})
const title_width = ref(240)
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">
      <div id="myDiv" class="dark:bg-black bg-white w-full pb-10">

        <div class="flex justify-center">
          <span class=" text-4xl font-medium text-gray-900 dark:text-white">查看點名表</span>
        </div>

        <div class="grid gap-6 grid-cols-1 xl:grid-cols-2 items-center pt-5 px-5">
          <LabelDisplay :title="'日期'" :title-width="title_width" :value="rollCallStore.data.edit_roll_call.date" />
          <LabelDisplay :title="'點名人員'" :title-width="title_width" :value="rollCallStore.data.edit_roll_call.roll_call_man" />
          <LabelDisplay :title="'(一支會)總人數'" :title-width="title_width" :value="memberFilterList('有到+沒到').length+''" />
          <LabelDisplay :title="'總共點到人數'" :title-width="title_width" :value="memberFilterList('有到').length + getVisitMemberAmount()+''" />
          <LabelDisplay :title="'(一支會)有到人數'" :title-width="title_width" :value="memberFilterList('有到').length+''" />
          <LabelDisplay :title="'拜訪人數'" :title-width="title_width" :value="getVisitMemberAmount()+''" />
        </div>

        <DisplayOptions :title="'長老定額組'" :member_list="getOrganizations('長老定額組', true)" :member_list2="getOrganizations('長老定額組', false)" />
        <DisplayOptions :title="'慈助會'" :member_list="getOrganizations('慈助會', true)" :member_list2="getOrganizations('慈助會', false)" />
        <DisplayOptions :title="'男青年'" :member_list="getOrganizations('男青年', true)" :member_list2="getOrganizations('男青年', false)" />
        <DisplayOptions :title="'女青年'" :member_list="getOrganizations('女青年', true)" :member_list2="getOrganizations('女青年', false)" />
        <DisplayOptions :title="'初級會'" :member_list="getOrganizations('初級會', true)" :member_list2="getOrganizations('初級會', false)" />
        <DisplayOptions :title="'傳教士'" :member_list="getOrganizations('傳教士', true)" :member_list2="getOrganizations('傳教士', false)" />
        <DisplayOptions :title="'慕道友'" :member_list="getOrganizations('慕道友', true)" :member_list2="getOrganizations('慕道友', false)" />

        <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <p class="px-5 pt-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">拜訪 人數: {{getVisitMemberAmount()}}</p>

          <div class="p-5 gap-3 grid grid-cols-1 md:grid-cols-2 items-center ">
            <!--    拜訪      -->
            <div  v-for="(member) in getVisit()" class="flex">
              <p class="me-3 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
              <p class="text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
            </div>
            <!--    拜訪-沒在名單上      -->
            <div  v-for="(member) in rollCallStore.data.edit_roll_call.member_visit_list" class="flex">
              <p class="me-3 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
              <p class="text-3xl text-yellow-700 dark:text-yellow-400">人數: {{member.amount}}</p>
            </div>
          </div>
        </div>


      </div>
      <div class="grid gap-6 grid-cols-2 lg:grid-cols-2 items-center pt-5 px-5">
        <button @click="downLoad()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-2xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          下載成圖片</button>
        <NuxtLink to="/admin/roll_call/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
          返回點名列表</NuxtLink>
      </div>

    </div>


  </div>
</template>

<style scoped>

</style>