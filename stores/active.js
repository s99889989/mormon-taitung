// stores/active.js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { apiFetch } from '~/utils/api'

export const useActiveStore = defineStore('active', () => {

  const data = reactive({
    search_active_month: '所有時間',
    active_map: new Map(),
    active_list: [],
    edit_active: {
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

  const activeList = computed(() => {
    let list = data.active_list.slice()

    if (data.search_active_month === '固定時間') {
      list = list.filter(a => a.fixed)
    } else if (data.search_active_month !== '所有時間') {
      list = list.filter(a => {
        const month = new Date(a.date).getMonth() + 1 + ''
        return month === data.search_active_month && !a.fixed
      })
    }

    return list
  })

  const add = async () => {
    await apiFetch('mormon/active/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.edit_active)
    })
    await refreshActive()
  }

  const update = async () => {
    await apiFetch('mormon/active/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.edit_active)
    })
    await refreshActive()
  }

  const remove = async (date, time) => {
    const saveName = date + '-' + time.replace(':', '-')
    await apiFetch('mormon/active/remove/' + saveName, { method: 'DELETE' })
    const index = data.active_map.get(saveName)
    data.active_list.splice(index, 1)
    refreshActiveMap()
  }

  const setEditActive = (date, time) => {
    const saveName = date + '-' + time.replace(':', '-')
    const index = data.active_map.get(saveName)
    data.edit_active = { ...data.active_list[index] }
  }

  const refreshActiveMap = () => {
    data.active_list.forEach((active, key) => {
      const saveName = active.date + '-' + active.time.replace(':', '-')
      data.active_map.set(saveName, key)
    })
  }

  const refreshActive = async () => {
    try {
      const response = await apiFetch('mormon/active/get')
      data.active_list = await response.json()
    } catch (error) {
      data.active_list = []
    } finally {
      refreshActiveMap()
    }
  }

  return { data, add, remove, update, setEditActive, refreshActive, activeList }
})
