
import { defineStore } from 'pinia'
import {initFlowbite} from "flowbite";


export const useActiveStore = defineStore('active', () => {
  //https://madustrialtd.asuscomm.com:9100/
  //https://localhost:9100/
  const data = reactive({
    main_url: 'https://madustrialtd.asuscomm.com:9100/',
    search_active_month: '所有月份',
    //紀錄saveName和active_list位置
    active_map: new Map(),
    active_list:[
      {
        fixed: false,
        week: '禮拜一',
        date: '',
        time: '',
        end_date: '',
        end_time: '',
        name: '',
        location: '',
        info: '',
        states: '規劃中',
      }
    ],
    edit_active:{
      fixed: false,
      week: '禮拜一',
      date: '2023-11-14',
      time: '15:43',
      end_date: '2023-11-14',
      end_time: '19:43',
      name: '測試活動',
      location: '教堂',
      info: '',
      states: '規劃中',
    }
  })

  //過濾後的點名列表
  const activeList = computed(() => {
    let activeDisplayList = data.active_list.slice();

    if (data.search_active_month !== '所有月份') {
      activeDisplayList = activeDisplayList.filter((active)=>{

        const month = new Date(active.date).getMonth()+1+'';
        return month === data.search_active_month;

      })
    }

    return activeDisplayList;
  })

  //新增
  const add = async () => {



    const url = data.main_url+'mormon/active/add';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.edit_active)

    })
        .then(res => res.text())
        .then(async data => {
          //刷新活動列表內容
          await refreshActive();
        })
  }
  //更新
  const update = async () => {
    const url = data.main_url+'mormon/active/update';
    console.log('更新')
    console.log(JSON.stringify(data.edit_active))



    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.edit_active)
    })
        .then(res => res.text())
        .then(async data => {
          //刷新活動列表內容
          await refreshActive();
        })
  }

  //移除
  const remove = async (date, time) => {
    const saveName = date+'-'+time.replace(':', '-');
    console.log(saveName)

    const url = data.main_url+'mormon/active/remove/'+saveName;

    fetch(url, {
      method: 'DELETE'

    }).then(res => {
      //從id獲取index
      const index = data.active_map.get(saveName);
      data.roll_call_list.splice(index, 1);
      //更新活動Map對應列表
      refreshActiveMap();
    })



  }

  //設置目前要查看的Active
  const setEditActive = (date, time) => {
    const saveName = date+'-'+time.replace(':', '-');
    const index = data.active_map.get(saveName);

    data.edit_active = { ...data.active_list[index] };
  }

  //更新活動Map對應列表
  const refreshActiveMap = () => {
    data.active_list.forEach((active, key, index)=>{
      const saveName = active.date+'-'+active.time.replace(':', '-');
      data.active_map.set(saveName, key)
    })
  }
  //刷新活動列表內容
  const refreshActive = async () => {
    data.active_list.length = 0;
    const url = data.main_url + 'mormon/active/get';
    try {
      const response = await fetch(url);
      data.active_list = await response.json();
    } catch (error) {
      data.active_list = [];
    } finally {
      //更新人員Map對應列表
      refreshActiveMap();

    }
  }

  return { data, add, remove, update, setEditActive, refreshActive, activeList }
})
