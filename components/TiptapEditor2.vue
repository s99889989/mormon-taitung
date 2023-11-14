<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

const addImage = () => {
  const url = window.prompt('URL')

  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

let editor = ref()

const content = ref('');

onMounted(() => {
   editor.value = new Editor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Image,
      Dropcursor,
    ],
    content: `
      <p>This is a basic example of implementing images. Drag to re-order.</p>
      <img class="w-1/2" src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
      <img class="w-1/2" src="https://source.unsplash.com/K9QHL52rE2k/800x400" />
    `,

  });
  console.log(editor.value.getJSON)
  // content.value = editor.value.getJSON;

})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<template>

  <div class="p-10" v-if="editor">
    <button @click="addImage" class="text-center text-2xl text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      setImage
    </button>
    <EditorContent class="tiptap" :editor="editor" />

    <br/>
    <p class="text-black text-xl">TEST</p>
    <p class="text-black text-xl">{{content}}</p>
  </div>
</template>



<style scoped>
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }
}
</style>