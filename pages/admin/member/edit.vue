<script setup lang="js">
import {useMembersStore} from "~/stores/members";

const membersStore = useMembersStore();

onMounted( () => {
  if(membersStore.data.editData.id.length == 0){
    const router = useRouter()
    router.push('/admin/member/list');
  }
})
//選擇的小孩ID
const data = reactive({
  selectChildID: '',
})
//新增小孩
const addChild = () => {
  if(data.selectChildID.length > 0){
    membersStore.data.editData.child.push(data.selectChildID);
  }
}
//移除小孩
const removeChild = (idx) => {
  membersStore.data.editData.child.splice(idx, 1);
}

//以UUID查看成員名稱
const getMemberName = (uuid) => {
  const idx = membersStore.data.member_map.get(uuid);
  // 检查索引是否有效
  if (typeof idx !== 'undefined' && idx >= 0 && idx < membersStore.data.member_list.length) {
    const member = membersStore.data.member_list[idx];
    return member.name;
  } else {
    // 处理索引无效的情况，可能返回默认值或者抛出错误，具体取决于你的需求
    return '';
  }
};
</script>

<template>

  <div class="dark:bg-black bg-white flex justify-center container-top w-full">
    <div class="w-full lg:w-3/4">

      <div class="flex justify-center">
        <span class=" text-4xl font-medium text-gray-900 dark:text-white">編輯成員</span>
      </div>

      <div class="grid gap-6 grid-cols-1 items-center pt-5 px-5">
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">姓名</label>
          <input v-model="membersStore.data.editData.name"  type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>
        <div class="flex items-center">
          <label for="gender" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">性別</label>
          <select id="gender"  v-model="membersStore.data.editData.gender" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>男</option>
            <option>女</option>
          </select>
        </div>
        <div id="date" class="flex items-center">
          <label for="birthday" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">生日</label>
          <input v-model="membersStore.data.editData.birthday" id="birthday" type="date" style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-40 text-3xl block font-medium text-gray-900 dark:text-white">聖職職位</label>
          <select  v-model="membersStore.data.editData.priesthood" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>無聖職職位</option>
            <option>亞倫聖職-執事</option>
            <option>亞倫聖職-教師</option>
            <option>亞倫聖職-祭司</option>
            <option>亞倫聖職-主教</option>
            <option>麥基洗德聖職-長老</option>
            <option>麥基洗德聖職-大祭司</option>
            <option>麥基洗德聖職-教長</option>
            <option>麥基洗德聖職-七十員</option>
            <option>麥基洗德聖職-使徒</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">召喚</label>
          <input v-model="membersStore.data.editData.calling" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-32 text-3xl block font-medium text-gray-900 dark:text-white">支聯會</label>
          <select  v-model="membersStore.data.editData.stake" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>花蓮支聯會</option>
            <option>其他支聯會</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">支會</label>
          <select  v-model="membersStore.data.editData.ward" id="countries" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>台東一支會</option>
            <option>其他支會</option>
          </select>
        </div>
        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">組織</label>
          <select v-model="membersStore.data.editData.organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>所有組織</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>男青年</option>
            <option>女青年</option>
            <option>初級會</option>
            <option>傳教士</option>
            <option>慕道友</option>
          </select>
        </div>

        <div class="flex items-center">
          <label for="first_name" class="w-20 text-3xl block font-medium text-gray-900 dark:text-white">地區</label>
          <input  v-model="membersStore.data.editData.area" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
        </div>

        <div id="date" class="flex items-center">
          <label for="address" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">地址</label>
          <input v-model="membersStore.data.editData.address" id="address" style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>

        <div class="grid gap-6 mb-6 grid-cols-3 items-center pt-5">
          <div class="">
            <input v-model="membersStore.data.search_member_name" type="text" id="first_name" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋姓名" required>
          </div>

          <select v-model="membersStore.data.search_member_stake" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>花蓮支聯會</option>
            <option>其他支聯會</option>
            <option>所有支聯會</option>
          </select>

          <select v-model="membersStore.data.search_member_ward" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>台東一支會</option>
            <option>其他支會</option>
            <option>所有支會</option>
          </select>

          <select v-model="membersStore.data.search_member_organizations" class="text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option>所有組織</option>
            <option>長老定額組</option>
            <option>慈助會</option>
            <option>男青年</option>
            <option>女青年</option>
            <option>初級會</option>
            <option>傳教士</option>
            <option>慕道友</option>
          </select>
        </div>



        <div id="date" class="flex items-center">
          <label for="address" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">父親</label>
          <select v-model="membersStore.data.editData.father" class="me-5 text-xl bg-gray-50 border grow border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option :value="member.id" v-for="(member) in membersStore.memberList">{{member.name}}</option>
          </select>
          <div style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{getMemberName(membersStore.data.editData.father)}}</div>
        </div>

        <div id="date" class="flex items-center">
          <label for="address" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">母親</label>
          <select v-model="membersStore.data.editData.mother" class="me-5 text-xl bg-gray-50 border grow border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option :value="member.id" v-for="(member) in membersStore.memberList">{{member.name}}</option>
          </select>
          <div style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{getMemberName(membersStore.data.editData.mother)}}</div>
        </div>

        <div id="date" class="flex items-center">
          <label for="address" style="width: 80px" class="text-3xl block font-medium text-gray-900 dark:text-white">配偶</label>
          <select v-model="membersStore.data.editData.spouse" class="me-5 text-xl bg-gray-50 border grow border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option :value="member.id" v-for="(member) in membersStore.memberList">{{member.name}}</option>
          </select>
          <div style="height: 50px" class="ps-5 flex items-center grow bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {{getMemberName(membersStore.data.editData.spouse)}}</div>
        </div>

        <div class=" bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

          <div class="p-5 flex items-center">
            <p class="me-5 text-gray-900 dark:text-white text-3xl block font-medium " >小孩</p>
            <select v-model="data.selectChildID" class="me-5 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option :value="member.id" v-for="(member) in membersStore.memberList" >{{member.name}}</option>
            </select>
            <button @click="addChild()" type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              增加</button>
          </div>
          <div class="px-5 pb-5 grid grid-cols-2 md:grid-cols-3 items-center">
            <div v-for="(id, index) in membersStore.data.editData.child" class="flex items-center">
              <p class="me-5 text-3xl text-gray-900 dark:text-white">{{getMemberName(id)}}</p>
              <button @click="removeChild(index)" type="button" class="p-2.5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-center rounded-lg text-xl dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                刪除</button>
            </div>
          </div>
        </div>

        <div class="grid gap-6 grid-cols-2">
          <NuxtLink to="/admin/member/list" @click="membersStore.edit()" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            編輯</NuxtLink>
          <NuxtLink to="/admin/member/list" type="button" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            取消</NuxtLink>
        </div>



      </div>



    </div>
  </div>
</template>

<style scoped>

</style>