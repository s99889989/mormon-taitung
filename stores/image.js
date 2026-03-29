// stores/image.js
import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/api'
import { getTodayDate } from '~/utils/date'

export const useImageStore = defineStore('image', () => {

  const data = reactive({
    search_active_month: '所有月份',
    select_image_path: '',
    image_list: [
      { url: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg', select: false },
      { url: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg', select: false },
    ],
    path: ['mormon', 'image', 'active', getTodayDate()],
  })

  const addImage = () => {
    const inputFile = document.getElementById('dropzone-file')
    const formData = new FormData()
    formData.append('file', inputFile.files[0])

    apiFetch('image/add/' + data.path.join('__'), {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(imageName => {
        data.select_image_path = '<img>' + data.path.join('/') + '/' + imageName + '</img>'
        console.log('檔案名稱:' + imageName)
      })
      .catch(error => console.error('錯誤:', error))
  }

  const insertImage = () => {
    const text = data.select_image_path
    const textarea = document.getElementById('editor')
    if (textarea == null) return

    const cursorStart = textarea.selectionStart
    const cursorEnd = textarea.selectionEnd
    const textBeforeCursor = textarea.value.substring(0, cursorStart)
    const textAfterCursor = textarea.value.substring(cursorEnd)

    textarea.value = textBeforeCursor + text + textAfterCursor
    textarea.setSelectionRange(cursorStart + text.length, cursorStart + text.length)
    textarea.focus()
  }

  const refreshImage = () => {
    apiFetch('image/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.path)
    })
      .then(res => res.json())
      .then(dataRes => {
        data.image_list.length = 0
        dataRes.forEach(image => {
          data.image_list.push({ url: image, select: false })
        })
      })
  }

  return { data, addImage, refreshImage, insertImage }
})
