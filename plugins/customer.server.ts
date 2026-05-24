// plugins/customer.server.ts
// 只在 server 端執行，SSR 時就把 customer 資料打進 store
// client hydration 時 Pinia 會自動同步這份狀態，不需要再打一次 API

import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL } from '~/utils/api'

export default defineNuxtPlugin(async (nuxtApp) => {
  const customerCookie = useCookie('mormon_customer')
  if (!customerCookie.value) return

  const customerStore = useCustomerStore(nuxtApp.$pinia as any)

  try {
    const data = await $fetch<any>(`${API_BASE_URL}mormon/customer/me`, {
      headers: useRequestHeaders(['cookie']),
    })
    if (!data.error) {
      customerStore.setCustomer(data)
    }
  } catch { /* 靜默 */ }
})
