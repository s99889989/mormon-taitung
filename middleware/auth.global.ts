import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL } from '~/utils/api'

export default defineNuxtRouteMiddleware(async (to) => {
  // ── /admin/* → 只有舊密碼登入的管理員 ──────────────────────────
  if (to.path.startsWith('/admin')) {
    const auth = useCookie('admin_auth')
    if (!auth.value) return navigateTo('/login')
    return
  }

  // ── /staff/* → 需要 Google 登入且 role 為 STAFF / EDITOR / ADMIN ──
  if (to.path.startsWith('/staff')) {
    const customerStore = useCustomerStore()

    // 先看 store 有沒有（client 端 navigation 時已有）
    let role = customerStore.data.customer?.role ?? ''

    // 沒有的話（SSR 或重整）→ 打 API 確認，帶上 cookie header
    if (!role) {
      try {
        const data = await $fetch<any>(`${API_BASE_URL}mormon/customer/me`, {
          credentials: 'include',
          headers: useRequestHeaders(['cookie']),
        })
        if (data && !data.error) {
          customerStore.setCustomer(data)
          role = data.role ?? ''
        }
      } catch { /* 未登入或 API 錯誤，role 維持空字串 */ }
    }

    if (!['STAFF', 'EDITOR', 'ADMIN'].includes(role)) return navigateTo('/')
  }
})