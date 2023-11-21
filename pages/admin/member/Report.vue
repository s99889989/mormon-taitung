<script setup lang="js">
import {useMembersStore} from "~/stores/members";
import {useRollCallStore} from "~/stores/roll_call.js";
import {initFlowbite} from "flowbite";

const membersStore = useMembersStore();
const rollCallStore = useRollCallStore();
//顯示計算用(本支會)
const memberFilterList = () => {
  let memberList = membersStore.data.member_list.slice();

  //名稱
  memberList = memberList.filter((member) =>
      member.name !== '戴志宇(新竹)'
  );
  //支聯會
  memberList = memberList.filter(
      (member) => member.stake === '花蓮支聯會'
  );
  //支會
  memberList = memberList.filter(
      (member) => member.ward === '台東一支會'
  );

  //組織
  memberList = memberList.filter(
      (element) => element.organizations === '長老定額組'
  );
  //年齡
  memberList = memberList.filter((element) =>
      getAge(element.birthday) < 55
  );

  //聚會次數
  memberList = memberList.filter((element) =>
      getPartyTimes(element) > 0
  );

  return memberList;
}
//查看聚會次數
const getPartyTimes = (m) => {
  let times = 0;
  rollCallStore.data.roll_call_list.forEach((roll_call)=>{
    roll_call.member_list.forEach(menubar=>{
      if(menubar.id === m.id){
        if(menubar.have){
          times++;
        }
      }
    })
  })
  return times;
}
const getMember = (uuid) => {
  const idx = membersStore.data.member_map.get(uuid);
  // 检查索引是否有效
  if (typeof idx !== 'undefined' && idx >= 0 && idx < membersStore.data.member_list.length) {
    return membersStore.data.member_list[idx];
  } else {
    // 处理索引无效的情况，可能返回默认值或者抛出错误，具体取决于你的需求
    return {
      id: '',
      name: '',
      english_name: '',
      gender: '男',
      birthday: '',
      priesthood: '無聖職職位',
      calling: '',
      stake: '花蓮支聯會',
      ward: '台東一支會',
      organizations: '慕道友',
      area: '',
      registration_number: '',
      address: '',
      father: '',
      mother: '',
      child: [],
    };
  }

}
const getAge = (birthday) => {
  let age = 0;
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

  return age;
}

const getChild = () => {
  let child_list = [{
    id: '',
    name: '',
    english_name: '',
    gender: '男',
    birthday: '',
    priesthood: '無聖職職位',
    calling: '',
    stake: '花蓮支聯會',
    ward: '台東一支會',
    organizations: '慕道友',
    area: '',
    registration_number: '',
    address: '',
    father: '',
    mother: '',
    child: [],
  }];

  child_list.length = 0;
  memberFilterList().forEach(m=>{
    m.child.forEach(m_id=>{
      const member = getMember(m_id);
      child_list.push(member)
    })
  })
  return child_list;
}

//是否在讀取
const loading = ref(false);
onMounted( () => {
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
</script>

<template>
  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">


      <!--   讀取圈圈   -->
      <div role="status" :class="{'hidden': !loading}" class="flex items-center justify-center h-1/2">
        <svg aria-hidden="true" class="w-28 h-28 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>


      <!--   內容   -->
      <div :class="{'hidden': loading}" class="mb-5 mt-5 bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <div class="flex justify-center">
          <span class=" text-4xl font-medium text-gray-900 dark:text-white">查看55歲以下長定組成員</span>
        </div>

        <div>
          <p class="px-2 pt-2 text-3xl text-amber-700 dark:text-amber-400">長定組</p>
          <p class="px-5 pt-5 text-3xl text-blue-700 dark:text-blue-400">  人數: {{memberFilterList().length}}</p>
        </div>
        <div class="p-5 gap-3 grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in memberFilterList()" class="flex">
            <p class="me-3 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>
            <p class="me-3 text-3xl text-sky-700 dark:text-sky-400">{{getAge(member.birthday)}}</p>
<!--            <p class="text-3xl text-sky-700 dark:text-orange-400">{{getPartyTimes(member)}}</p>-->


          </div>


        </div>

        <p class="px-5 pt-5 text-3xl text-blue-700 dark:text-blue-400">  小孩: {{getChild().length}}</p>
        <div class="p-5 gap-3 grid grid-cols-2 md:grid-cols-3 items-center ">

          <div  v-for="(member) in getChild()" class="flex">
            <p class="me-3 text-3xl text-gray-900 dark:text-white">{{member.name}}</p>

          </div>


        </div>
      </div>




      <NuxtLink to="/admin/member/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
        返回列表</NuxtLink>



    </div>
  </div>
</template>

<style scoped>

</style>