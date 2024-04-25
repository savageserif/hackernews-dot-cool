<template>
  <component
    :is="iconComponent"
    class="text-gray-500"
    :class="[small ? 'h-5 w-5' : 'h-6 w-6']"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
  name: string;
  small?: boolean;
}>();

const iconComponent = computed(() => {
  return defineAsyncComponent(
    () => import(`@/assets/icons/${props.name + (props.small ? '.small' : '')}.svg`)
  );
});
</script>
