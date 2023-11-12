import {ref, computed, onMounted} from 'vue'
import { defineStore } from 'pinia'

export const useDarkModeStore = defineStore('dark_mode', () => {


  const data = reactive({
    dark: false,
    display_name: '關燈',

  })

  const change_dark_mode = () => {
    data.dark = !data.dark;
    if(data.dark){
      data.display_name = '開燈';
      document.documentElement.classList.add('dark');
    }else {
      data.display_name = '關燈';
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem("dark_mode", data.dark+"");
  }

  onMounted(() => {
    data.dark = Boolean(localStorage.getItem("dark_mode"));

    if(data.dark){
      data.display_name = '開燈';
      document.documentElement.classList.add('dark');
    }else {
      data.display_name = '關燈';
      document.documentElement.classList.remove('dark')
    }

  })

  return {data, change_dark_mode }
})
