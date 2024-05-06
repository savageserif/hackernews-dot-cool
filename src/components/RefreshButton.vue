<template>
  <button
    class="flex h-8 items-center rounded-sm p-1 transition-colors duration-200 hover:bg-gray-700/15 hover:duration-0 active:bg-gray-700/20"
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
