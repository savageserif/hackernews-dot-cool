<template>
  <div
    class="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto bg-gray-100 pb-2"
  >
    <img
      class="w-[7.625rem]"
      :src="placeholderAsset"
    />
    <span class="font-serif-heading text-[1.5rem] font-bold text-gray-500/55">
      No story selected
    </span>
  </div>
</template>

<script setup lang="ts">
import placeholderAsset from '@/assets/placeholder.png';
</script>
