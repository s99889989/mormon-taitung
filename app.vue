<template>
  <NavBar class="hidden md:block"/>
  <UpDownButton/>
  <NuxtPage />
  <BottomBar class="md:hidden"/>
</template>
<script setup lang="ts">
import UpDownButton from "~/components/UpDownButton.vue";
</script>