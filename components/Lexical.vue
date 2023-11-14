<script setup lang="ts">
import {createEditor} from 'lexical';

const config = {
  namespace: 'MyEditor',
  theme: {

  },
  onError: console.error
};

const editor = createEditor(config);

const contentEditableElement = document.getElementById('editor');

editor.setRootElement(contentEditableElement);

</script>

<template>
<div class="w-full h-60 bg-black dark:bg-white" id="editor">

</div>
</template>

<style scoped>

</style>