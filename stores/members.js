import {defineStore} from 'pinia'
import {computed} from "vue";

export const useMembersStore = defineStore('members', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //http://localhost:9100/
  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_stake: '花蓮',
    search_member_ward: '台東一',
    search_member_organizations: '所有',
    search_member_person_type: '所有',
    search_member_calling: '所有',
    search_member_positive: '所有',
    search_member_age: 100,
    //紀錄UUID和member_list位置
    member_map: new Map(),
    //成員列表
    member_list: [
      {
        id: '',
        name: '',
        english_name: '',
        gender: '',
        birthday: '',
        spouse: '',
        priesthood: '',
        calling: '',
        stake: '',
        ward: '',
        person_type: '',
        organizations: '',
        positive: '',
        area: '',
        registration_number: '',
        address: '',
        father: '',
        mother: '',
        child: [],
      },
    ],
    family_list:[
      {
        father: '',
        mother: '',
        main: '',
        children: [{

        }],
      }
    ],
    //編輯的成員
    editData: {
      id: '',
      name: '',
      english_name: '',
      gender: '男',
      spouse: '',
      birthday: '',
      priesthood: '無聖職職位',
      calling: '',
      stake: '花蓮',
      ward: '台東一',
      person_type: '',
      organizations: '慕道友',
      positive: '',
      area: '',
      registration_number: '',
      address: '',
      father: '',
      mother: '',
      child: [],
    },
  })
  const reportMember = computed(()=>{
    let member_list= [
      {
        id: '',
        name: '',
        english_name: '',
        gender: '',
        birthday: '',
        spouse: '',
        priesthood: '',
        calling: '',
        stake: '',
        ward: '',
        person_type: '',
        organizations: '',
        positive: '',
        area: '',
        registration_number: '',
        address: '',
        father: '',
        mother: '',
        child: [],
      },
    ]

    let displayMembers = data.member_list.slice();
    displayMembers = displayMembers.filter((member) =>
        member.stake === '花蓮'
        && member.ward === '台東一'
        && member.organizations !== '非成員'
        && member.organizations !== '傳教士'
        && member.person_type === '成員'
        && member.positive === '積極'
    );
    member_list = [];
    displayMembers.forEach(member=>{
      let c = false;
      const inputID = member.id;
      member_list.forEach(m=>{
        if(member.father.length === 0 && member.mother.length === 0 && member.child.length === 0){
          c = true;
        }
        if(m.child.includes(member.father) || m.child.includes(member.mother)){
          c = true;
        }
        if(member.child.includes(m.father) || member.child.includes(m.mother)){
          c = true;
        }
        if(m.spouse === inputID){
          c = true;
        }
        if(m.father === member.father){
          c = true;
        }
        if(m.father === inputID){
          c = true;
        }
        if(m.mother === inputID){
          c = true;
        }
        if(m.child.includes(inputID)){
          c = true;
        }
      })

      if(c !== true){
        member_list.push(member);
      }

    })

    return  member_list;
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
    if (data.search_member_stake !== '所有') {
      displayMembers = displayMembers.filter(
          (element) => element.stake === data.search_member_stake
      );
    }
    //支會
    if (data.search_member_ward !== '所有') {
      displayMembers = displayMembers.filter(
          (element) => element.ward === data.search_member_ward
      );
    }
    //組織
    if (data.search_member_organizations !== '所有') {
      displayMembers = displayMembers.filter(
          (element) => element.organizations === data.search_member_organizations
      );
    }
    //召喚
    if (data.search_member_calling !== '所有') {
      displayMembers = displayMembers.filter(
          (element) => element.calling.includes(data.search_member_calling)
      );
    }
    //人員類型
    if(data.search_member_person_type !== '所有'){
      displayMembers = displayMembers.filter(
          (element) => element.person_type === data.search_member_person_type
      );
    }
    //積極-不積極
    if(data.search_member_positive !== '所有'){
      displayMembers = displayMembers.filter(
          (element) => element.positive === data.search_member_positive
      );
    }

    //年齡
    if (data.search_member_age > 0) {
      displayMembers = displayMembers.filter((element) =>
          getAge(element.birthday) < data.search_member_age
      );
    }
    return displayMembers;
  })
  //年齡
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
//更新
  const edit2 = (member) => {

    const url = data.main_url+'mormon/member/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member)
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



  return { data, memberList, add, edit, edit2, setEditValue, remove, refreshMember, reportMember }
})
