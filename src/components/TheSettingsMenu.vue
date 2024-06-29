<template>
  <Menu>
    <MenuButton
      :as="BaseButton"
      icon="settings"
      class="ui-open:bg-primary-color/10"
      :class="[view.isTouchDevice ? 'pr-[0.375rem]' : 'pr-[0.25rem]']"
      title="Settings"
    />
    <MenuItems
      class="absolute right-1 w-max divide-y divide-separator-color rounded bg-blank-color shadow-menu focus:outline-none dark:bg-controls-color dark:shadow-menu-dark"
      :class="[view.isTouchDevice ? 'bottom-[2.6875rem]' : 'bottom-[2.1875rem]']"
    >
      <div
        v-for="(group, index) in menuContents"
        :key="index"
        :class="[view.isTouchDevice ? 'py-2.5' : 'py-2']"
      >
        <MenuItem
          v-for="(item, index) in group"
          :key="index"
          :as="item.heading ? 'div' : 'button'"
          :disabled="item.heading"
          class="flex w-full items-center gap-0.5 pl-1 pr-8 text-left *:flex-none ui-active:bg-controls-color ui-disabled:pb-[0.0625rem] ui-disabled:font-medium ui-disabled:tracking-wide ui-disabled:text-secondary-color ui-disabled:[font-feature-settings:'smcp','c2sc'] dark:ui-active:bg-blank-color/75"
          :class="[view.isTouchDevice ? 'h-9 ui-disabled:h-8' : 'h-8 ui-disabled:h-7']"
          @click="item.action"
        >
          <BaseIcon
            v-if="item.selected"
            name="checkmark-list"
          />
          <div
            v-else
            :class="[view.isTouchDevice ? 'size-7' : 'size-6']"
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
