// stores/active.js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { apiFetch } from '~/utils/api'

const emptyActive = () => ({
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
  visible: true,
  images: [],
  attachments: [],
  tags: [],
  showInFrontCategory: false,   // 是否在前台分類顯示
})

export const useActiveStore = defineStore('active', () => {

  const data = reactive({
    search_year: '所有年份',
    search_tag: '',
    search_visible: '',
    active_map: new Map(),
    active_list: [],
    edit_active: emptyActive(),
  })

  // ── 後台篩選（年份 + 標籤）────────────────────────────────
  const activeList = computed(() => {
    let list = data.active_list.slice()

    if (data.search_year !== '所有年份') {
      list = list.filter(a => {
        const year = new Date(a.date).getFullYear() + ''
        return year === data.search_year
      })
    }

    if (data.search_tag) {
      list = list.filter(a => Array.isArray(a.tags) && a.tags.includes(data.search_tag))
    }

    if (data.search_visible === 'show') {
      list = list.filter(a => a.visible !== false)
    } else if (data.search_visible === 'hide') {
      list = list.filter(a => a.visible === false)
    }

    return list.sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // 所有出現過的年份（後台篩選用）
  const usedYears = computed(() => {
    const set = new Set()
    data.active_list.forEach(a => {
      if (a.date) set.add(new Date(a.date).getFullYear() + '')
    })
    return [...set].sort((a, b) => b - a)
  })

  // 固定活動（前台用，只顯示 visible !== false）
  const fixedList = computed(() =>
      data.active_list.filter(a => a.fixed && a.visible !== false)
  )

  // 一般活動（前台用，只顯示 visible !== false，依日期倒序）
  const normalList = computed(() =>
      data.active_list
          .filter(a => !a.fixed && a.visible !== false)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  // 全部固定活動（後台用，不過濾 visible）
  const fixedListAll = computed(() =>
      data.active_list.filter(a => a.fixed)
  )

  // 全部一般活動（後台用，不過濾 visible）
  const normalListAll = computed(() =>
      data.active_list
          .filter(a => !a.fixed)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
  )

  // 目前所有已使用的標籤
  const usedTags = computed(() => {
    const set = new Set()
    data.active_list.forEach(a => (a.tags || []).forEach(t => set.add(t)))
    return [...set]
  })

  // 前台分類用標籤（只顯示 showInFrontCategory === true 的活動的標籤）
  const frontCategoryTags = computed(() => {
    const set = new Set()
    data.active_list
        .filter(a => a.showInFrontCategory && a.visible !== false)
        .forEach(a => (a.tags || []).forEach(t => set.add(t)))
    return [...set]
  })

  const add = async () => {
    await apiFetch('mormon/active/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.edit_active)
    })
    await refreshActive()
  }

  const update = async (oldSaveName) => {
    await apiFetch(`mormon/active/update/${oldSaveName}`, {
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
    data.edit_active = {
      ...emptyActive(),
      ...data.active_list[index],
      images: data.active_list[index].images || [],
      attachments: data.active_list[index].attachments || [],
      tags: data.active_list[index].tags || [],
      showInFrontCategory: data.active_list[index].showInFrontCategory || false,
    }
  }

  const initNewActive = () => {
    const today = new Date()
    const date = today.toISOString().split('T')[0]
    const hours = String(today.getHours()).padStart(2, '0')
    const minutes = String(today.getMinutes()).padStart(2, '0')
    const time = `${hours}:${minutes}`
    data.edit_active = {
      ...emptyActive(),
      date,
      time,
      end_date: date,
      end_time: time,
    }
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

  return {
    data,
    add, remove, update,
    setEditActive, initNewActive,
    refreshActive,
    activeList, fixedList, normalList, fixedListAll, normalListAll,
    usedTags, usedYears, frontCategoryTags,
  }
})