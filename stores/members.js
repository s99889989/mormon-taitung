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
    search_member_organizations: '所有組織',
    search_member_calling: '所有召喚',
    //紀錄UUID和member_list位置
    member_map: new Map(),
    //成員列表
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
      },
    ],
    //編輯的成員
    editData: {
      id: '',
      name: '',
      priesthood: '無聖職職位',
      calling: '',
      stake: '花蓮支聯會',
      ward: '台東一支會',
      organizations: '慕道友',
      area: '',
      registration_number: '',
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
    if (data.search_member_stake !== '所有支聯會') {
      displayMembers = displayMembers.filter(
          (element) => element.stake === data.search_member_stake
      );
    }
    //支會
    if (data.search_member_ward !== '所有支會') {
      displayMembers = displayMembers.filter(
          (element) => element.ward === data.search_member_ward
      );
    }
    //組織
    if (data.search_member_organizations !== '所有組織') {
      displayMembers = displayMembers.filter(
          (element) => element.organizations === data.search_member_organizations
      );
    }
    //組織
    if (data.search_member_calling !== '所有召喚') {
      displayMembers = displayMembers.filter(
          (element) => element.calling.includes(data.search_member_calling)
      );
    }
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
        .then(uuidString => {
          data.editData.id = uuidString;
          data.member_list.unshift(data.editData);
          //更新人員Map對應列表
          refreshMemberMap();

        })

  }
  //更新
  const edit = () => {

    const url = data.main_url+'mormon/member/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.editData)
    }).then(res => {
      const id = data.editData.id;
      const index = data.member_map.get(id);
      data.member_list[index] =  data.editData;
    })

  }


  //設置編輯值
  const setEditValue = (id) => {
    //從id獲取index
    const index = data.member_map.get(id);
    data.editData =  data.member_list[index];
  }

  //移除
  const remove = (id) => {
    const url = data.main_url+'mormon/member/remove/' + id;

    fetch(url, {
      method: 'DELETE'

    }).then(res => res.text())
        .then(data => {

        })
    //從id獲取index
    const index = data.member_map.get(id);
    //從列表刪除
    data.member_list.splice(index, 1);
    //更新人員Map對應列表
    refreshMemberMap();

  }
  //更新人員Map對應列表
  const refreshMemberMap = () => {
    data.member_list.forEach((member, key, index)=>{
      data.member_map.set(member.id, key)
    })
  }

  //刷新人員列表
  const refreshMember = async () => {
    if(data.member_list.length < 2){
      const url = data.main_url+'mormon/member/get';
      try {
        const response = await fetch(url);
        data.member_list = await response.json();
      } catch (error) {
        data.member_list =  [];
      }finally {
        //更新人員Map對應列表
        refreshMemberMap();
      }
    }
  }

  return { data, memberList, add, edit, setEditValue, remove, refreshMember }
})
