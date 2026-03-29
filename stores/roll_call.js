// stores/roll_call.js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { apiFetch } from '~/utils/api'

// 共用：把 API 回傳的 roll_call raw data 轉成前端格式
const buildRollCall = (value, memberList) => {
  const roll_call = {
    date: value.date,
    roll_call_man: value.roll_call_man,
    member_list: [],
    member_visit_list: [],
  }

  memberList.forEach(value1 => {
    roll_call.member_list.push({
      id: value1.id,
      name: value1.name,
      stake: value1.stake,
      ward: value1.ward,
      organizations: value1.organizations,
      person_type: value1.person_type,
      positive: value1.positive,
      area: value1.area,
      death: value1.death,
      have: value.member_list.includes(value1.id),
    })
  })

  value.member_visit_list.forEach(value1 => {
    const parts = value1.split(' _ ')
    roll_call.member_visit_list.push({
      name: parts[0],
      amount: parseInt(parts[1]),
    })
  })

  return roll_call
}

export const useRollCallStore = defineStore('roll_call', () => {

  const data = reactive({
    search_member_name: '',
    search_member_stake: '花蓮',
    search_member_ward: '台東一',
    search_member_organizations: '所有',
    search_member_person_type: '成員',
    search_member_positive: '積極',
    search_member_have: '所有',
    search_roll_call_year: '所有',
    search_roll_call_month: '所有',
    edit_roll_call_date: '',
    roll_call_map: new Map(),
    member_list: [],
    roll_call_list: [],
    edit_roll_call: {
      date: '',
      name: '',
      roll_call_man: '',
      member_list: [],
      member_visit_list: [],
    }
  })

  const rollCallList = computed(() => {
    let list = data.roll_call_list.slice().reverse()

    if (data.search_roll_call_year !== '所有') {
      list = list.filter(e => new Date(e.date).getFullYear() + '' === data.search_roll_call_year)
    }
    if (data.search_roll_call_month !== '所有') {
      list = list.filter(e => new Date(e.date).getMonth() + 1 + '' === data.search_roll_call_month)
    }

    return list
  })

  const getEditRollCall = () => {
    const index = data.roll_call_map.get(data.edit_roll_call_date)
    return data.roll_call_list[index]
  }

  const add = async () => {
    const payload = {
      date: data.edit_roll_call.date,
      roll_call_man: data.edit_roll_call.roll_call_man,
      member_list: data.edit_roll_call.member_list.filter(m => m.have).map(m => m.id),
      member_visit_list: data.edit_roll_call.member_visit_list
        .filter(m => m.name.length > 0 && m.amount > 0)
        .map(m => m.name + ' _ ' + m.amount),
    }

    await apiFetch('mormon/roll_call/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await refreshRollCall()
  }

  const update = async () => {
    const payload = {
      date: data.edit_roll_call.date,
      roll_call_man: data.edit_roll_call.roll_call_man,
      member_list: data.edit_roll_call.member_list.filter(m => m.have).map(m => m.id),
      member_visit_list: data.edit_roll_call.member_visit_list
        .filter(m => m.name.length > 0 && m.amount > 0)
        .map(m => m.name + ' _ ' + m.amount),
    }

    await apiFetch('mormon/roll_call/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    await refreshRollCall()
  }

  const remove = async (date) => {
    await apiFetch('mormon/roll_call/remove/' + date, { method: 'DELETE' })
    const index = data.roll_call_map.get(date)
    data.roll_call_list.splice(index, 1)
    refreshRollCallMap()
  }

  const setEditRollCall = (date) => {
    const index = data.roll_call_map.get(date)
    data.edit_roll_call = { ...data.roll_call_list[index] }
  }

  const refreshRollCallMap = () => {
    data.roll_call_list.forEach((roll_call, key) => {
      data.roll_call_map.set(roll_call.date, key)
    })
  }

  // 合併後的單一函式：dateString 有值就抓特定月份，否則抓全部
  const refreshRollCall = async (dateString = null) => {
    let rawList = []
    try {
      let response
      if (dateString) {
        response = await apiFetch('mormon/roll_call/get_date', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: dateString
        })
      } else {
        response = await apiFetch('mormon/roll_call/get')
      }
      rawList = await response.json()
    } catch (error) {
      rawList = []
    } finally {
      data.roll_call_list.length = 0
      rawList.forEach(value => {
        data.roll_call_list.push(buildRollCall(value, data.member_list))
      })
      refreshRollCallMap()
    }
  }

  // 保留原本介面，內部改用 refreshRollCall
  const refreshRollCallCurrentMonth = async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    await refreshRollCall(`${year}-${month}`)
  }

  return {
    data, rollCallList, setEditRollCall,
    add, update, getEditRollCall, remove,
    refreshRollCall, refreshRollCallCurrentMonth
  }
})
