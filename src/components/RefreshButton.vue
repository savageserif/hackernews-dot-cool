<template>
  <button
    class="flex h-8 items-center rounded p-1 ring-focus-color ring-offset-1 ring-offset-controls-color transition-colors duration-200 hover:bg-primary-color/10 hover:duration-0 focus:outline-none focus-visible:ring-2 active:bg-primary-color/15"
    @click="animate()"
  >
    <BaseLabel
      icon="refresh"
      class="transition-transform duration-500 ease-out"
      :style="{ transform: `rotate(${degrees}deg)` }"
    />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseLabel from '@/components/BaseLabel.vue';

const degrees = ref(0);

function animate() {
  degrees.value += 360;
}
</script>
