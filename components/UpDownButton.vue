<script setup lang="ts">
//滾動到底
const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
};
//滾動到頂
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
</script>

<template>
    <button id="goto" @click="scrollToTop" class="go_top">TOP</button>
    <button @click="scrollToBottom" class="go_down">Down</button>
</template>

<style scoped>
.go_top {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 90px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;

  transition: opacity 0.5s ease;
}
.go_down {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #2a4f6f;
  text-decoration: none;
  color: #eee;
  z-index: 999;
  right: 30px;
  bottom: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  border:2px solid #222;

  transition: opacity 0.5s ease;
}

@media (max-width: 768px) {
  .go_top {
    right: 10px;
    bottom: 130px;
  }
  .go_down {
    right: 10px;
    bottom: 70px;
  }
}
</style>