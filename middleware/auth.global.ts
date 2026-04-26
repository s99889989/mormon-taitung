export default defineNuxtRouteMiddleware((to) => {
  // 只保護 /admin/* 路由
  if (!to.path.startsWith('/admin')) return

  const auth = useCookie('admin_auth')

  if (!auth.value) {
    return navigateTo('/login')
  }
})
