<script setup lang="ts">
definePageMeta({ layout: 'admin' })
import { apiFetch } from '~/utils/api.js'
const config = useRuntimeConfig()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const isError = ref(false)
const loading = ref(false)

const handleChangePassword = async () => {
  message.value = ''
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    message.value = '請填寫所有欄位'
    isError.value = true
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    message.value = '新密碼與確認密碼不一致'
    isError.value = true
    return
  }

  loading.value = true
  try {
    await apiFetch('mormon/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    })
    message.value = '密碼修改成功'
    isError.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e: any) {
    message.value = '修改失敗'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="dark:bg-black bg-white container-top w-full flex justify-center">
    <div class="w-full max-w-md px-5 pt-8">
      <p class="text-black dark:text-white text-4xl font-bold mb-8">修改密碼</p>

      <div class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目前密碼</label>
          <input v-model="currentPassword" type="password"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none
                   focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新密碼</label>
          <input v-model="newPassword" type="password"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none
                   focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">確認新密碼</label>
          <input v-model="confirmPassword" type="password"
                 class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none
                   focus:ring-2 focus:ring-blue-500" />
        </div>

        <p v-if="message" :class="isError ? 'text-red-500' : 'text-green-500'" class="text-sm">
          {{ message }}
        </p>

        <button
            @click="handleChangePassword"
            :disabled="loading"
            class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium
                 transition-colors disabled:opacity-50">
          {{ loading ? '處理中...' : '確認修改' }}
        </button>
      </div>
    </div>
  </div>
</template>