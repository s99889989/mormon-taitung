import {defineStore} from 'pinia'
import {computed} from "vue";

export const useMembersStore = defineStore('members', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //https://localhost:9100/
  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_stake: '花蓮支聯會',
    search_member_ward: '台東一支會',
    search_member_organizations: '所有分類',
    member_list: [
      {
        id: '',
        name: '',
        priesthood: '',
        calling: '',
        stake: '',
        ward: '',
        organizations: '',
        area: '',
        registration_number: '',
        objectID: 0,
      },
    ],
    editData: {
      id: '',
      name: '',
      priesthood: '無職位',
      calling: '',
      stake: '花蓮支聯會',
      ward: '台東一支會',
      organizations: '選擇組織',
      area: '',
      registration_number: '',
      objectID: 0,
    },
  })
  //處理後成員列表


  const memberList = computed(() => {
    let displayMembers = data.member_list.slice();


    //名稱
    if (data.search_member_name.length > 0) {
      displayMembers = displayMembers.filter((element) =>
          element.name.includes(data.search_member_name)
      );
    }
    //支聯會
    if (data.search_member_stake !== '所有分類') {
      displayMembers = displayMembers.filter(
          (element) => element.stake === data.search_member_stake
      );
    }
    //支會
    if (data.search_member_ward !== '所有分類') {
      displayMembers = displayMembers.filter(
          (element) => element.ward === data.search_member_ward
      );
    }
    //組織
    if (data.search_member_organizations !== '所有分類') {
      displayMembers = displayMembers.filter(
          (element) => element.organizations === data.search_member_organizations
      );
    }
    displayMembers.forEach((member, index)=>{
      member.objectID = index;
    })
    return displayMembers;
  })

  //新增
  const add = async () => {
    const url = data.main_url+'mormon/member/add';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.editData)
    })
        .then(res => res.text())
        .then(async data => {
          //刷新內容
          await refresh();
        })



  }
  //更新
  const edit = async () => {

    const url = data.main_url+'mormon/member/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.editData)
    })
        .then(res => res.text())
        .then(async data => {
          //刷新內容
          await refresh();
        })

  }
  //獲取全部
  const getAll = async () => {
    const url = data.main_url+'mormon/member/get';
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  //設置編輯值
  const getEdit = (id) => {
    console.log(id)
     const url = data.main_url+'mormon/member/get/'+id;

    fetch(url, {
      method: 'GET'

    })
        .then(res => res.json())
        .then(resData => {
          data.editData = resData;
        })
  }

  //移除
  const remove = async (id, idx) => {
    const url = data.main_url+'mormon/member/remove/' + id;

    fetch(url, {
      method: 'DELETE'

    })
        .then(res => res.text())
        .then(data => {

        })
    data.member_list.splice(idx, 1);
  }

  //刷新列表
  const refresh = async () => {

    data.member_list = await getAll();
  }

  onMounted(async () => {

    await refresh();


  })

  return { data, memberList, add, edit, getEdit, remove, refresh, getAll }
})
