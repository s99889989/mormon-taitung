
import { defineStore } from 'pinia'
import {computed} from "vue";

export const useRollCallStore = defineStore('roll_call', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //https://localhost:9100/

  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_stake: '花蓮支聯會',
    search_member_ward: '台東一支會',
    search_member_organizations: '所有分類',
    search_member_have: '所有',
    search_roll_call_month: '所有月份',
    roll_call_list: [
      {
        date: '',
        roll_call_man: '',
        member_list: [],
        member_visit_list: [],
        objectID: 0,
        member_visit_list2: [
          {
            name: '',
            amount: 1,
          },
        ],
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

    edit_member_visit_list: [
      {
        name: '',
        amount: 1,
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

    //是否有來
    if (data.search_member_have !== '所有') {
      displayMembers = displayMembers.filter((element) =>
          data.search_member_have === '有來' ? element.have : !element.have
      );
    }

    return displayMembers;
  });

  const memberHaveList = computed(() => {
    let displayMembers = data.member_list.slice();


    //是否有來
    displayMembers = displayMembers.filter((element) =>
        element.have
    );

    return displayMembers;
  });

  const rollCallList = computed(() => {
    let displayRollCalls = data.roll_call_list.slice();
    if (data.search_roll_call_month !== '所有月份') {
      displayRollCalls = displayRollCalls.filter((element)=>{

        const month = new Date(element.date).getMonth()+1+'';
        return month === data.search_roll_call_month;

      })
    }
    displayRollCalls.forEach((member, index)=>{
      member.objectID = index;
    })
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
    data.editData.member_list.length =0;
    data.member_list.forEach((member) =>{
      if(member.have){
        data.editData.member_list.push(member.id);
      }
    })

    data.editData.member_visit_list.length = 0;
    data.edit_member_visit_list.forEach((member)=>{
      if(member.name.length > 0 && member.amount > 0){
        data.editData.member_visit_list.push(member.name+' _ '+member.amount)
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
        .then(async data => {
          //刷新內容
          await refresh();
        })


  }
  //更新
  const edit = async () => {
    data.editData.member_list.length =0;
    data.member_list.forEach((member) =>{
      if(member.have){
        data.editData.member_list.push(member.id);
      }
    })

    data.editData.member_visit_list.length = 0;
    data.edit_member_visit_list.forEach((member)=>{
      if(member.name.length > 0 && member.amount > 0){
        data.editData.member_visit_list.push(member.name+' _ '+member.amount)
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
        .then(async data => {
          //刷新內容
          await refresh();
        })

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

          data.edit_member_visit_list.length = 0;
          data.editData.member_visit_list.forEach((memberString)=>{
            const parts = memberString.split(' _ ');
            const name = parts[0];
            const amount = parseInt(parts[1], 10);
            data.edit_member_visit_list.push({
              name: name,
              amount: amount,
            })

          })

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
    console.log('刷新列表')
    data.roll_call_list.forEach((roll_call)=>{
      roll_call.member_visit_list2 = [{
        name: '',
        amount: 1,
      },];
      roll_call.member_visit_list2.length = 0;
      roll_call.member_visit_list.forEach((memberString)=>{

        const parts = memberString.split(' _ ');
        const name = parts[0];
        const amount = parseInt(parts[1], 10);

        roll_call.member_visit_list2.push({
          name: name,
          amount: amount,
        })
      })
    })



  }
  //刷新人員列表
  const refreshMember = async () => {
    data.member_list = await getAllMembers();
  }

  onMounted(async () => {

    await refresh();


  })

  return { data, rollCallList, memberList, memberHaveList, add, edit, getEdit, remove, refresh, refreshMember }
})
