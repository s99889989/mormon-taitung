import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('Main', () => {
  const main_url = ref('https://madustrialtd.asuscomm.com:9100/')
  //https://madustrialtd.asuscomm.com:9100/
  //https://localhost:9100/

  return { main_url }
})
