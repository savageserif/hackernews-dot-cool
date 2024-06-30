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
      class="flex w-32 items-center justify-center ring-focus-color ring-offset-1 ring-offset-controls-color focus:outline-none focus-visible:ring-2 ui-checked:relative ui-checked:bg-separator-color ui-not-checked:cursor-pointer ui-not-checked:border ui-not-checked:border-separator-color ui-not-checked:text-secondary-color ui-not-checked:hover:bg-separator-color/40"
      :class="[
        view.isTouchDevice
          ? 'h-10 p-1.5 @[26rem]:w-[10.5rem] @[26rem]:pr-2'
          : 'h-8 p-1 @[26rem]:w-40 @[26rem]:pr-1.5',
        index === 0 ? 'mr-[-0.0625rem] rounded-l' : 'rounded-r',
      ]"
    >
      <BaseLabel :icon="option.icon">
        <span class="hidden @[26rem]:inline">
          {{ option.label }}
        </span>
      </BaseLabel>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import BaseLabel from '@/components/BaseLabel.vue';
import { useViewStore } from '@/stores/ViewStore';

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
