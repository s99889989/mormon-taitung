<script setup lang="ts">
import { apiFetch } from '~/utils/api.js'
definePageMeta({
  layout: 'blank',
  middleware: [
    function() {
      const auth = useCookie('admin_auth')
      if (auth.value) {
        return navigateTo('/admin/roll_call/list')
      }
    }
  ]
})

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '請輸入帳號和密碼'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await apiFetch('mormon/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })

    if (res.ok) {
      // 登入成功，由 Nuxt 自己寫 cookie
      const auth = useCookie('admin_auth', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
      })
      auth.value = 'true'
      await navigateTo('/admin/roll_call/list')
    } else {
      error.value = '帳號或密碼錯誤'
    }
  } catch (e: any) {
    error.value = '帳號或密碼錯誤'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-xl">

      <!-- Logo + 標題 -->
      <div class="flex flex-col items-center mb-8">
        <img src="/assets/icon/hat.png" class="h-16 mb-3" alt="Logo" />
        <h1 class="text-2xl font-bold text-white">台東一支會</h1>
        <p class="text-gray-400 text-sm mt-1">後台管理系統</p>
      </div>

      <!-- 表單 -->
      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">帳號</label>
          <input
            v-model="username"
            type="text"
            placeholder="請輸入帳號"
            @keyup.enter="handleLogin"
            class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">密碼</label>
          <input
            v-model="password"
            type="password"
            placeholder="請輸入密碼"
            @keyup.enter="handleLogin"
            class="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>

        <!-- 錯誤訊息 -->
        <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>

        <!-- 登入按鈕 -->
        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed
                 text-white font-semibold rounded-lg transition-colors text-base mt-2">
          {{ loading ? '登入中...' : '登入' }}
        </button>
      </div>

    </div>
  </div>
</template>
