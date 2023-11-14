<template>
<!--  <editor-content :editor="editor" />-->
  <div>
    <Editor v-model="content" />

    <div class="content">
      <h3>Content</h3>
      <pre><code>{{ content }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

let content = ref('<p>A Vue.js wrapper component for tiptap to use <code>v-model</code>.</p>');

// let editor = ref()
//
// onMounted(()=>{
//   editor.value = new Editor({
//     content: '<p>I’m running Tiptap with Vue.js. 🎉</p>',
//     extensions: [
//       StarterKit,
//     ],
//   })
// })
//
// onBeforeUnmount(() => {
//   editor.value.destroy()
// })
</script>

<style lang="scss">

.tiptap {
  > * + * {
    margin-top: 0.75em;
    border: 0;
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