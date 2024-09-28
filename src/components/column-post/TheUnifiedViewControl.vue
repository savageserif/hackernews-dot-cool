<template>
  <RadioGroup
    v-model="activeUnifiedColumnView"
    class="flex"
  >
    <RadioGroupOption
      v-for="(option, index) in radioOptions"
      :key="index"
      :value="option.view"
      :title="option.label"
      class="flex items-center justify-center ring-focus-color ring-offset-1 ring-offset-controls-color focus:outline-none focus-visible:ring-2 ui-checked:relative ui-checked:bg-separator-color ui-not-checked:cursor-pointer ui-not-checked:border ui-not-checked:border-separator-color ui-not-checked:text-secondary-color"
      :class="[
        view.isTouchDevice
          ? 'h-10 w-[10.25rem] p-1.5 pr-2'
          : 'h-8 w-40 p-1 pr-1.5 ui-not-checked:hover:bg-separator-color/40',
        index === 0 ? 'mr-[-0.0625rem] rounded-l' : 'rounded-r',
      ]"
    >
      <BaseLabel :icon="option.icon">
        {{ option.label }}
      </BaseLabel>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup lang="ts">
const view = useViewStore();

const { activeUnifiedColumnView } = storeToRefs(view);

const radioOptions = [
  {
    view: 'link',
    icon: 'link',
    label: 'Linked Website',
  },
  {
    view: 'comments',
    icon: 'comment',
    label: 'Comments',
  },
];
</script>
