
import { defineStore } from 'pinia'
import {computed} from "vue";

export const useRollCallStore = defineStore('roll_call', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //http://localhost:9100/

  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_member_name: '',
    search_member_stake: '花蓮支聯會',
    search_member_ward: '台東一支會',
    search_member_organizations: '所有組織',
    search_member_have: '有到+沒到',
    search_roll_call_month: '所有月份',
    edit_roll_call_date: '',
    //紀錄UUID和roll_call_list位置
    roll_call_map: new Map(),
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
    //點名表列表
    roll_call_list: [
      {
        date: '',
        name: '',
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
      },
    ],
    edit_roll_call:{
      date: '',
      name: '',
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
  })
  //選擇編輯的點名表
  const getEditRollCall = () => {
    const edit_roll_call_index = data.roll_call_map.get(data.edit_roll_call_date);
    return data.roll_call_list[edit_roll_call_index];
  }
  //過濾後的點名列表
  const rollCallList = computed(() => {
    let displayRollCalls = data.roll_call_list.slice();

    if (data.search_roll_call_month !== '所有月份') {
      displayRollCalls = displayRollCalls.filter((element)=>{

        const month = new Date(element.date).getMonth()+1+'';
        return month === data.search_roll_call_month;

      })
    }

    return displayRollCalls;
  })

  //新增
  const add = async () => {

    let roll_call_list=
      {
        date: data.edit_roll_call.date,
        roll_call_man: data.edit_roll_call.roll_call_man,
        member_list: ['123', '456'],
        member_visit_list: [],
      };

    roll_call_list.member_list.length = 0;
    data.edit_roll_call.member_list.forEach((member) =>{
      if(member.have){
        roll_call_list.member_list.push(member.id);
      }
    })


    data.edit_roll_call.member_visit_list.forEach((member)=>{
      if(member.name.length > 0 && member.amount > 0){
        roll_call_list.member_visit_list.push(member.name+' _ '+member.amount)
      }

    })

    const url = data.main_url+'mormon/roll_call/add';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roll_call_list)
    })
        .then(res => res.text())
        .then(async data => {
          //刷新內容
          await refreshRollCall();
        })


  }
  //更新
  const update = async () => {


    let roll_call_list=
        {
          date: data.edit_roll_call.date,
          roll_call_man: data.edit_roll_call.roll_call_man,
          member_list: ['123', '456'],
          member_visit_list: [],
        };


    roll_call_list.member_list.length = 0;
    data.edit_roll_call.member_list.forEach((member) =>{
      if(member.have){
        roll_call_list.member_list.push(member.id);
      }
    })


    data.edit_roll_call.member_visit_list.forEach((member)=>{
      if(member.name.length > 0 && member.amount > 0){
        roll_call_list.member_visit_list.push(member.name+' _ '+member.amount)
      }

    })

    const url = data.main_url+'mormon/roll_call/update';

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roll_call_list)
    })
        .then(res => res.text())
        .then(async data => {
          //刷新內容
          await refreshRollCall();
        })

  }

  //移除
  const remove = async (date) => {
    const url = data.main_url+'mormon/roll_call/remove/' + date;

    fetch(url, {
      method: 'DELETE'

    }).then(res => {
          //從id獲取index
          const index = data.roll_call_map.get(date);
          data.roll_call_list.splice(index, 1);
          //更新人員Map對應列表
          refreshRollCallMap();
        })



  }

  //設置目前要查看的RollCall
  const setEditRollCall = (date) => {
    const index = data.roll_call_map.get(date);
    data.edit_roll_call = { ...data.roll_call_list[index] };
  }

  //刷新列表
  const refreshRollCall = async () => {
    let roll_call_list= [
      {
        date: '',
        roll_call_man: '',
        member_list: [],
        member_visit_list: [],
      },
    ];
    const url = data.main_url+'mormon/roll_call/get';
    try {
      const response = await fetch(url);
      roll_call_list =  await response.json();
    } catch (error) {
      roll_call_list =  [];
    }finally {
      data.roll_call_list.length = 0;
      roll_call_list.forEach(value => {

        //RollCall設置
        const roll_call = {
          date: value.date,
          roll_call_man: value.roll_call_man,
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

        //Member設置
        roll_call.member_list.length = 0;

        data.member_list.forEach(value1 => {

          const member = {
            id: value1.id,
            name: value1.name,
            stake: value1.stake,
            ward: value1.ward,
            organizations: value1.organizations,
            area: value1.area,
            have: false,
          }
          if(value.member_list.includes(value1.id)){
            member.have = true;
          }

          roll_call.member_list.push(member);
        })
        //拜訪Member設置
        roll_call.member_visit_list.length = 0;
        value.member_visit_list.forEach(value1 => {
          const parts = value1.split(' _ ');
          const name = parts[0];
          const amount = parseInt(parts[1]);
          const member_visit = {
            name: name,
            amount: amount,
          }
          roll_call.member_visit_list.push(member_visit);
        })
        //RollCall放入
        data.roll_call_list.push(roll_call)

      })


      //更新人員Map對應列表
      refreshRollCallMap();
    }
  }
  

  
  //更新人員Map對應列表
  const refreshRollCallMap = () => {
    data.roll_call_list.forEach((roll_call, key)=>{
      data.roll_call_map.set(roll_call.date, key)
    })
  }

  return { data, rollCallList, setEditRollCall, add, update, getEditRollCall, remove, refreshRollCall }
})
