<template>
  <BaseButton
    icon="refresh"
    label-class="transition-transform duration-500 ease-out"
    :label-style="`transform: rotate(${degrees}deg)`"
    @click="animate()"
  />
</template>

<script setup lang="ts">
const degrees = ref(0);

function animate() {
  degrees.value += 360;
}
</script>
