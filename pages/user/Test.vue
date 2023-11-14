<template>
  <button @click="addClass" :class="{ 'text-white': true, 'text-xl': true, 'new-class': hasNewClass }">按鈕</button>
</template>

<script setup>
import { ref } from 'vue';

const hasNewClass = ref(false);

const addClass = () => {
  hasNewClass.value = true;
};
</script>

<style scoped>
.new-class {
  /* 新的样式定义 */
  color: red;
  font-size: 2rem;
  /* 可以根据需要添加其他新样式 */
}
</style>