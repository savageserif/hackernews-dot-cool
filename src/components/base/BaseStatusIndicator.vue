<template>
  <div
    class="flex flex-col items-center justify-center pb-[1.1875rem] pt-[1.0625rem]"
    :class="[fullHeight ? 'h-full' : '']"
  >
    <span
      v-if="message"
      class="mx-10 text-balance text-center text-small text-secondary-color"
      v-html="message"
    />
    <BaseIcon
      v-else
      name="loading"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fullHeight?: boolean;
  message?: string;
}>();
</script>

<style scoped>
:deep(path) {
  opacity: 1;
  animation: pulse 0.8s linear infinite;
}

:deep(path):nth-child(2) {
  animation-delay: -0.1s;
}

:deep(path):nth-child(3) {
  animation-delay: -0.2s;
}

:deep(path):nth-child(4) {
  animation-delay: -0.3s;
}

:deep(path):nth-child(5) {
  animation-delay: -0.4s;
}

:deep(path):nth-child(6) {
  animation-delay: -0.5s;
}

:deep(path):nth-child(7) {
  animation-delay: -0.6s;
}

:deep(path):nth-child(8) {
  animation-delay: -0.7s;
}

@keyframes pulse {
  90% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
