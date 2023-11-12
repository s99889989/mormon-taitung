
import { defineStore } from 'pinia'


export const useActiveStore = defineStore('active', () => {

  const data = reactive({
    active_list:[
      {
        data: '',
        time: '',
        name: '',
        location: '',
        image: [],
        info: [],
        states: '',
      }
    ],
    edit_active:{
      data: '',
      time: '',
      name: '',
      location: '',
      image: [],
      info: [],
      states: '',
    }
  })

  return { data }
})
