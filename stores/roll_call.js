
import { defineStore } from 'pinia'
import {computed} from "vue";

export const useRollCallStore = defineStore('roll_call', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //https://localhost:9100/

  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_organizations: '選擇組織',
    search_member_have: '所有',
    search_roll_call_month: '選擇月份',
    roll_call_list: [
      {
        date: '',
        roll_call_man: '',
        member_list: [],
        member_visit_list: [],
      },
    ],
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
        have: false,
      },
    ],
    editData: {
      date: '',
      roll_call_man: '',
      member_list: [],
      member_visit_list: [],
    },
  })
  const memberList = computed(() => {
    let displayMembers = data.member_list.slice(); // 创建一个副本以确保响应性

    if (data.search_member_name.length > 0) {
      displayMembers = displayMembers.filter((element) =>
          element.name.includes(data.search_member_name)
      );
    }

    if (data.search_member_organizations !== '選擇組織') {
      displayMembers = displayMembers.filter(
          (element) => element.organizations === data.search_member_organizations
      );
    }

    if (data.search_member_have !== '所有') {
      displayMembers = displayMembers.filter((element) =>
          data.search_member_have === '有來' ? element.have : !element.have
      );
    }



    return displayMembers;
  });

  const rollCallList = computed(() => {
    let displayRollCalls = data.roll_call_list.slice();
    if (data.search_roll_call_month !== '選擇月份') {
      displayRollCalls = displayRollCalls.filter((element)=>{

        const month = new Date(element.date).getMonth()+1+'';
        return month === data.search_roll_call_month;

      })
    }

    return displayRollCalls;
  })

  //獲取全部成員
  const getAllMembers = async () => {
    const url = data.main_url+'mormon/member/get';
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('錯誤:', error);
      return [];
    }
  }



  //新增
  const add = async () => {

    data.member_list.forEach((member) =>{
      if(member.have){
        data.editData.member_list.push(member.id);
      }
    })


    const url = data.main_url+'mormon/roll_call/add';
    console.log(JSON.stringify(data.editData))
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.editData)
    })
        .then(res => res.text())
        .then(data => {
          // console.log('新增:', data);
        })

    //刷新內容
    await refresh();
  }
  //更新
  const edit = async () => {
    data.editData.member_list.length = 0;
    data.member_list.forEach((member) =>{
      if(member.have){
        data.editData.member_list.push(member.id);
      }
    })
    const url = data.main_url+'mormon/roll_call/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.editData)
    })
        .then(res => res.text())
        .then(data => {
          // console.log('新增:', data);
        })
    //刷新內容
    await refresh();
  }
  //獲取全部
  const getAll = async () => {
    const url = data.main_url+'mormon/roll_call/get';
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('错误:', error);
      return [];
    }
  }

  //設置編輯值
  const getEdit = (id) => {
    console.log(id)
    const url = data.main_url+'mormon/roll_call/get/'+id;
    console.log('GET')
    fetch(url, {
      method: 'GET'

    })
        .then(res => res.json())
        .then(async resData => {
          data.editData = resData;

          data.member_list = await getAllMembers();

          data.member_list.forEach((member)=>{
              if(data.editData.member_list.includes(member.id)){
                member.have = true;
              }
          })

        })
  }

  //移除
  const remove = async (date, idx) => {
    const url = data.main_url+'mormon/roll_call/remove/' + date;

    fetch(url, {
      method: 'DELETE'

    })
        .then(res => res.text())
        .then(data => {
          console.log('獲取:', data);
        })

    data.roll_call_list.splice(idx, 1);
  }

  //刷新列表
  const refresh = async () => {
    data.roll_call_list = await getAll();
  }

  const refreshMember = async () => {
    data.member_list = await getAllMembers();
  }

  onMounted(async () => {

    await refresh();


  })

  return { data, rollCallList, memberList, add, edit, getEdit, remove, refresh, refreshMember }
})
