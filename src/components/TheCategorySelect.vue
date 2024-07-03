<template>
  <Listbox v-model="currentCategory">
    <ListboxButton
      :as="BaseButton"
      class="relative ui-open:bg-primary-color/10"
      :class="[view.isTouchDevice ? 'pr-1' : 'pr-0.5']"
    >
      {{ content.currentCategoryName }}
      <BaseIcon
        name="chevron-up-down"
        small
        class="ml-[-0.125rem]"
      />
    </ListboxButton>
    <ListboxOptions
      class="absolute rounded bg-blank-color shadow-menu focus:outline-none dark:bg-controls-color dark:shadow-menu-dark"
      :class="[
        view.isTouchDevice
          ? 'top-[2.9375rem] -translate-x-[1.5rem] py-2'
          : 'top-[2.4375rem] -translate-x-[1.375rem] py-1.5',
      ]"
    >
      <ListboxOption
        v-for="(categoryName, category) in content.categoryNames"
        v-slot="{ selected }"
        :key="category"
        :value="category"
        class="flex cursor-pointer items-center gap-0.5 pl-1 pr-8"
        :class="[
          view.isTouchDevice
            ? 'h-9'
            : 'h-8 ui-active:bg-controls-color dark:ui-active:bg-blank-color/75',
        ]"
      >
        <BaseIcon
          v-if="selected"
          name="checkmark-list"
        />
        <div
          v-else
          :class="[view.isTouchDevice ? 'size-7' : 'size-6']"
        />
        {{ categoryName }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();

const content = useContentStore();
const { currentCategory } = storeToRefs(content);
</script>
