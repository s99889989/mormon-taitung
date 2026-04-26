<script setup lang="ts">
</script>

<template>
  <div class="dark:bg-black bg-gray-50 min-h-screen">
    <AdminNavBar class="hidden md:block" />
    <UpDownButton />
    <slot />
    <BottomBar class="md:hidden" />
  </div>
</template>
