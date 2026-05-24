// stores/customer.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', () => {
  const data = reactive({
    customer: null,
  })

  const setCustomer = (c) => {
    data.customer = c
  }

  const clearCustomer = () => {
    data.customer = null
  }

  return { data, setCustomer, clearCustomer }
})