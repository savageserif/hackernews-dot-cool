<template>
  <main class="flex h-full select-none gap-px bg-gray-200 font-sans text-base text-gray-950">
    <ThePostsColumn class="flex-none basis-90" />
    <TheContentColumn class="min-w-90 flex-1" />
    <TheCommentsColumn class="flex-none basis-90" />
  </main>
</template>

<script setup lang="ts">
import ThePostsColumn from '@/components/ThePostsColumn.vue';
import TheContentColumn from '@/components/TheContentColumn.vue';
import TheCommentsColumn from '@/components/TheCommentsColumn.vue';
</script>

<style>
#app {
  height: 100vh;
}
</style>
