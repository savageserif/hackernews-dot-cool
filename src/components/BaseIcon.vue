<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    :class="[
      small ? 'size-5' : view.isTouchDevice ? 'size-7' : 'size-6',
      inheritColor ? 'text-inherit' : 'text-icon-color',
    ]"
  />
  <div
    v-else
    :class="[small ? 'size-5' : 'size-6']"
  />
</template>

<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue';
import { useViewStore } from '@/stores/ViewStore';

const props = defineProps<{
  name: string;
  small?: boolean;
  inheritColor?: boolean;
}>();

const view = useViewStore();

const iconComponent = shallowRef();

watchEffect(async () => {
  iconComponent.value = null;

  import(`@/assets/icons/${props.name + (props.small ? '.small' : '')}.svg`).then((imported) => {
    iconComponent.value = imported.default;
  });
});
</script>
