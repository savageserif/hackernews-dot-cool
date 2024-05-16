<template>
  <Menu>
    <MenuButton
      :as="BaseButton"
      icon="settings"
      class="ui-open:bg-gray-700/15 pr-[0.25rem]"
      title="Settings"
    />
    <MenuItems
      class="shadow-menu absolute bottom-[2.1875rem] right-1 w-max divide-y divide-gray-200 rounded-sm bg-white focus:outline-none"
    >
      <div
        v-for="(group, index) in menuContents"
        :key="index"
        class="py-2"
      >
        <MenuItem
          v-for="(item, index) in group"
          :key="index"
          :as="item.heading ? 'div' : 'button'"
          :disabled="item.heading"
          class="ui-active:bg-gray-100 ui-disabled:h-7 ui-disabled:font-medium ui-disabled:pb-[0.0625rem] ui-disabled:text-gray-500 ui-disabled:tracking-wide ui-disabled:[font-feature-settings:'smcp','c2sc'] flex h-8 w-full items-center gap-0.5 pl-1 pr-8 text-left *:flex-none"
          @click="item.action"
        >
          <BaseIcon
            v-if="item.selected"
            name="checkmark-list"
          />
          <div
            v-else
            class="size-6"
          />
          <span>{{ item.text }}</span>
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();
const { colorScheme, prioritizedView } = storeToRefs(view);

const menuContents = ref<
  {
    text: string;
    heading?: boolean;
    selected?: ComputedRef<boolean>;
    action?: () => void;
  }[][]
>([
  [
    {
      text: 'Primary View',
      heading: true,
    },
    {
      text: 'Linked Website',
      selected: computed(() => prioritizedView.value === 'link'),
      action: () => (prioritizedView.value = 'link'),
    },
    {
      text: 'Comments',
      selected: computed(() => prioritizedView.value === 'comments'),
      action: () => (prioritizedView.value = 'comments'),
    },
  ],
  [
    {
      text: 'Color Scheme',
      heading: true,
    },
    {
      text: 'System',
      selected: computed(() => colorScheme.value === 'system'),
      action: () => (colorScheme.value = 'system'),
    },
    {
      text: 'Light',
      selected: computed(() => colorScheme.value === 'light'),
      action: () => (colorScheme.value = 'light'),
    },
    {
      text: 'Dark',
      selected: computed(() => colorScheme.value === 'dark'),
      action: () => (colorScheme.value = 'dark'),
    },
  ],
  [
    {
      text: 'View Source on GitHub',
      action: () => window.open('https://github.com/savageserif/hackernews-dot-cool', '_blank'),
    },
    {
      text: 'About This Website',
      action: () => {},
    },
  ],
]);
</script>
