<script setup lang="js">
import {useRollCallStore} from "~/stores/roll_call";
import html2canvas from 'html2canvas';
const rollCallStore = useRollCallStore();
const organizationsOrder = [
  '長老定額組',
  '慈助會',
  '男青年',
  '女青年',
  '初級會',
  '傳教士',
  '慕道友',
];
const roll_call = ref(
    {
      date: '',
      roll_call_man: '',
      member_list: [{
        id: '',
        name: '',
        stake: '',
        ward: '',
        organizations: '',
        area: '',
        have: false,
      }],
      member_visit_list: [
        {
          name: '',
          amount: 1,
        },
      ],
    }
)
//總人數
const allAmount = () => {
  let amount = 0;

  amount = roll_call.value.member_list.filter((member) =>
      member.have
  ).length;

  roll_call.value.member_visit_list.forEach(value => {
    amount += value.amount;
  })

  return amount;
}

const getAllMember = computed(()=>{
  let memberList = roll_call.value.member_list;

  memberList = memberList.filter(value => {
    return value.have;
  })
  memberList = memberList.sort((a, b) => {
    const indexA = organizationsOrder.indexOf(a.organizations);
    const indexB = organizationsOrder.indexOf(b.organizations);

    return indexA - indexB;
  });

  return memberList;
})
//獲取本支會分類人員
const getOrganizations = (organizations) => {
  let memberList = roll_call.value.member_list;

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
    if(!member.have){
      b = false;
    }

    return b;
  })

  return memberList;
}

const getVisit = () => {
  let memberList = roll_call.value.member_list;

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

//台東一支會數
const oneAmount = () => {
  let amount = 0;

  amount = roll_call.value.member_list.filter((member) =>{

    let b = true;
    if(member.stake !== '花蓮支聯會'){
      b = false;
    }
    if(member.ward !== '台東一支會'){
      b = false;
    }
    if(!member.have){
      b = false;
    }
    return b;
      }).length;

  return amount;
}

const downLoad = async () => {

  const targetDiv = document.getElementById('myDiv');


  const canvas = await html2canvas(targetDiv);


  const imageData = canvas.toDataURL('image/png');


  const link = document.createElement('a');
  link.href = imageData;
  link.download = 'captured_image.png';


  link.click();
}

onMounted(()=>{
  roll_call.value = rollCallStore.data.edit_roll_call;

  if(roll_call.value.date.length == 0){
    const router = useRouter()
    router.push('/admin/roll_call/list');
  }

})

</script>

<template>
  <div id="myDiv" class="dark:bg-black bg-white flex justify-center container-top w-full">

    <div class="w-full lg:w-3/4">

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">日期</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{roll_call.date}}</p>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">點名人員</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{roll_call.roll_call_man}}</p>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-32 text-3xl block font-medium text-gray-900 dark:text-white">總人數</label>

          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{allAmount()}}</p>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-96 text-3xl block font-medium text-gray-900 dark:text-white">台東一支會人數</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{oneAmount()}}</p>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-96 text-3xl block font-medium text-gray-900 dark:text-white">拜訪人數</label>
          <p class="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{allAmount()-oneAmount()}}</p>
        </div>

      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">長老定額組 人數: {{getOrganizations('長老定額組').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('長老定額組')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">慈助會 人數: {{getOrganizations('慈助會').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('慈助會')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">男青年 人數: {{getOrganizations('男青年').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('男青年')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">女青年 人數: {{getOrganizations('女青年').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('女青年')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">初級會 人數: {{getOrganizations('初級會').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('初級會')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">傳教士 人數: {{getOrganizations('傳教士').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('傳教士')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">慕道友 人數: {{getOrganizations('慕道友').length}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getOrganizations('慕道友')" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
        </div>
      </div>

      <div class="mx-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <p class="p-5 text-3xl text-fuchsia-700 dark:text-fuchsia-400">拜訪 人數: {{allAmount()-oneAmount()}}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 items-center ">
          <div  v-for="(member) in getVisit()" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="p-2 text-3xl text-sky-700 dark:text-sky-400">{{member.area}}</p>
          </div>
          <div  v-for="(member) in roll_call.member_visit_list" class="flex">
            <p class="p-2 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>

            <p class="p-2 text-3xl text-yellow-700 dark:text-yellow-400">人數: {{member.amount}}</p>
          </div>
        </div>
      </div>
      <div class="mx-5 mt-5">
        <button @click="downLoad()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
          下載</button>
      </div>


      <br/> <br/> <br/>

    </div>

  </div>
</template>

<style scoped>

</style>