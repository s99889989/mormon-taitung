import { useCustomerStore } from '~/stores/customer'
import { API_BASE_URL } from '~/utils/api'

export default defineNuxtRouteMiddleware(async (to) => {
  // SSR 階段直接跳過，cookie 跨 domain 帶不到，只在 client 端驗證
  if (import.meta.server) return

  // ── /admin/* → 只有舊密碼登入的管理員 ──────────────────────────
  if (to.path.startsWith('/admin')) {
    const auth = useCookie('admin_auth')
    if (!auth.value) return navigateTo('/login')
    return
  }

  // ── /staff/* → 需要 Google 登入且 role 為 STAFF / EDITOR / ADMIN ──
  if (to.path.startsWith('/staff')) {
    const customerStore = useCustomerStore()
    let role = customerStore.data.customer?.role ?? ''

    // store 沒有（重整或直接進 /staff）→ 打 API 確認
    if (!role) {
      try {
        const data = await $fetch<any>(`${API_BASE_URL}mormon/customer/me`, {
          credentials: 'include',
        })
        if (data && !data.error) {
          customerStore.setCustomer(data)
          role = data.role ?? ''
        }
      } catch { /* 未登入或 API 錯誤 */ }
    }

    if (!['STAFF', 'EDITOR', 'ADMIN'].includes(role)) return navigateTo('/')
  }
})