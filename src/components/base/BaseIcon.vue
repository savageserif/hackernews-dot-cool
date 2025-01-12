<template>
  <div
    :class="[
      small ? 'size-5' : view.isTouchDevice && name !== 'loading' ? 'size-7' : 'size-6',
      inheritColor ? 'text-inherit' : 'text-icon-color',
    ]"
    v-html="svgContent"
  />
</template>

<script setup lang="ts">
import icons from '@/assets/icons';

const view = useViewStore();

const props = defineProps<{
  name: string;
  small?: boolean;
  inheritColor?: boolean;
}>();

const svgContent = computed(() => {
  const iconName = props.name + (props.small ? '.small' : '');
  return icons[iconName] || '';
});
</script>
