// stores/dark_mode.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('dark_mode', () => {

  const data = reactive({
    dark: false,
    display_name: '關燈',
  })

  const init = () => {
    const saved = localStorage.getItem('dark_mode')
    data.dark = saved === 'true'
    data.display_name = data.dark ? '開燈' : '關燈'
    document.documentElement.classList.toggle('dark', data.dark)
  }

  const change_dark_mode = () => {
    data.dark = !data.dark
    data.display_name = data.dark ? '開燈' : '關燈'
    document.documentElement.classList.toggle('dark', data.dark)
    localStorage.setItem('dark_mode', data.dark + '')
  }

  return { data, init, change_dark_mode }
})
