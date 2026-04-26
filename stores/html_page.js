// stores/html_page.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { apiFetch } from '~/utils/api'

export const useHtmlPageStore = defineStore('html_page', () => {

  const data = reactive({
    page_list: [],
  })

  const refreshPages = async () => {
    try {
      const res = await apiFetch('mormon/html-page/get')
      data.page_list = await res.json()
    } catch {
      data.page_list = []
    }
  }

  const upload = async (slug, title, file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('slug', slug)
    formData.append('title', title)
    await apiFetch('mormon/html-page/upload', {
      method: 'POST',
      body: formData,
    })
    await refreshPages()
  }

  const remove = async (slug) => {
    await apiFetch(`mormon/html-page/remove/${slug}`, { method: 'DELETE' })
    await refreshPages()
  }

  return { data, refreshPages, upload, remove }
})
