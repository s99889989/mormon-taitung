// stores/link.js
import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { apiFetch } from '~/utils/api'

export const useLinkStore = defineStore('link', () => {

  const data = reactive({
    link_list: [],
    edit_link: emptyLink(),
  })

  function emptyLink() {
    return {
      id:      '',
      name:    '',
      url:     '',
      desc:    '',
      icon:    '🔗',
      visible: true,
      sort:    0,
    }
  }

  // 前台用（只顯示 visible，依 sort 排序）
  const visibleList = computed(() =>
    data.link_list
      .filter(l => l.visible !== false)
      .slice()
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
  )

  const add = async () => {
    await apiFetch('mormon/link/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.edit_link),
    })
    await refreshLink()
  }

  const update = async () => {
    await apiFetch('mormon/link/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.edit_link),
    })
    await refreshLink()
  }

  const remove = async (id) => {
    await apiFetch(`mormon/link/remove/${id}`, { method: 'DELETE' })
    await refreshLink()
  }

  const setEditLink = (id) => {
    const found = data.link_list.find(l => l.id === id)
    data.edit_link = found ? { ...found } : emptyLink()
  }

  const initNewLink = () => {
    data.edit_link = emptyLink()
  }

  const refreshLink = async () => {
    try {
      const res = await apiFetch('mormon/link/get')
      data.link_list = await res.json()
    } catch {
      data.link_list = []
    }
  }

  return {
    data,
    add, update, remove,
    setEditLink, initNewLink,
    refreshLink,
    visibleList,
    emptyLink,
  }
})
