<template>
  <component
    :is="iconComponent"
    :class="[small ? 'h-5 w-5' : 'h-6 w-6', inheritColor ? 'text-inherit' : 'text-gray-500']"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

const props = defineProps<{
  name: string;
  small?: boolean;
  inheritColor?: boolean;
}>();

const iconComponent = computed(() => {
  return defineAsyncComponent(
    () => import(`@/assets/icons/${props.name + (props.small ? '.small' : '')}.svg`)
  );
});
</script>
