<template>
  <div
    class="rounded bg-accent-color"
    :class="[view.isTouchDevice ? 'mx-1.5' : 'mx-1']"
  >
    <img
      :class="[view.isTouchDevice ? 'h-7' : 'h-6']"
      :src="logoImage"
    />
  </div>
</template>

<script setup lang="ts">
import logoImage from '@/assets/logo.png';

const view = useViewStore();
</script>
