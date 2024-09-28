<template>
  <div :class="[small ? 'size-5' : view.isTouchDevice ? 'size-7' : 'size-6']">
    <component
      v-if="iconComponent"
      :is="iconComponent"
      class="h-full w-full"
      :class="[inheritColor ? 'text-inherit' : 'text-icon-color']"
    />
  </div>
</template>

<script setup lang="ts">
const view = useViewStore();

const props = defineProps<{
  name: string;
  small?: boolean;
  inheritColor?: boolean;
}>();

const iconComponent = shallowRef();

watchEffect(async () => {
  iconComponent.value = null;

  import(`../../assets/icons/${props.name + (props.small ? '.small' : '')}.svg`).then(
    (imported) => {
      iconComponent.value = imported.default;
    }
  );
});
</script>
