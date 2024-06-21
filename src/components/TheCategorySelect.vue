<template>
  <Listbox v-model="currentCategory">
    <ListboxButton
      :as="BaseButton"
      class="relative pr-1 ui-open:bg-primary-color/10"
    >
      {{ content.currentCategoryName }}
      <BaseIcon
        name="chevron-up-down"
        small
        class="ml-[-0.125rem]"
      />
    </ListboxButton>
    <ListboxOptions
      class="absolute top-[2.4375rem] -translate-x-[1.375rem] rounded bg-blank-color py-1.5 shadow-menu focus:outline-none"
    >
      <ListboxOption
        v-for="(categoryName, category) in content.categoryNames"
        v-slot="{ selected }"
        :key="category"
        :value="category"
        class="flex h-8 cursor-pointer items-center gap-0.5 pl-1 pr-8 ui-active:bg-controls-color"
      >
        <BaseIcon
          v-if="selected"
          name="checkmark-list"
        />
        <div
          v-else
          class="size-6"
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
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
const { currentCategory } = storeToRefs(content);
</script>
