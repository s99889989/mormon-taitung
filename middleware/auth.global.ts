import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL } from '~/utils/api'

export default defineNuxtRouteMiddleware(async (to) => {
  // ── /admin/* → 只有舊密碼登入的管理員 ──────────────────────────
  if (to.path.startsWith('/admin')) {
    const auth = useCookie('admin_auth')
    if (!auth.value) return navigateTo('/login')
    return
  }

  // // ── /staff/* → 需要 Google 登入且 role 為 STAFF / EDITOR / ADMIN ──
  // if (to.path.startsWith('/staff')) {
  //   const customerCookie = useCookie('mormon_customer')
  //   if (!customerCookie.value) return navigateTo('/')
  //
  //   // 先看 store 有沒有（client-side 導航時已有）
  //   const customerStore = useCustomerStore()
  //   let role = customerStore.data.customer?.role ?? ''
  //
  //   // store 沒有（SSR 或重整直接進 /staff）→ 打 API 確認
  //   if (!role) {
  //     try {
  //       const data = await $fetch<any>(
  //           `${API_BASE_URL}mormon/customer/me`,
  //           { headers: useRequestHeaders(['cookie']) }
  //       )
  //       if (!data.error) {
  //         customerStore.setCustomer(data)
  //         role = data.role ?? ''
  //       }
  //     } catch {
  //       return navigateTo('/')
  //     }
  //   }
  //
  //   if (!['STAFF', 'EDITOR', 'ADMIN'].includes(role)) return navigateTo('/')
  // }
})