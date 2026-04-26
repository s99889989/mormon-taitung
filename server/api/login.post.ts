export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const { username, password } = body

  if (username === config.adminUsername && password === config.adminPassword) {
    // 設置 cookie，有效期 7 天
    setCookie(event, 'admin_auth', 'true', {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'strict',
    })
    return { success: true }
  }

  throw createError({
    statusCode: 401,
    message: '帳號或密碼錯誤',
  })
})
