import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { useStorage, useWindowSize } from '@vueuse/core';
import type { RemovableRef } from '@vueuse/core';

export const useViewStore = defineStore('view', () => {
  const colorScheme = useStorage<'light' | 'dark' | 'system'>('colorScheme', 'system');
  const prioritizedView = useStorage<'link' | 'comments'>('prioritizedView', 'link');

  const { width: windowWidth } = useWindowSize();

  // number of columns available depending on window width
  const availableColumns = computed((): 1 | 2 | 3 => {
    if (windowWidth.value < 721) return 1;
    else if (windowWidth.value < 1082) return 2;
    else return 3;
  });

  // state/properties of the secondary column
  const secondaryColumn: {
    isOpen: RemovableRef<boolean>;
    isExpanded: RemovableRef<boolean>;
    isExpandable: ComputedRef<boolean>;
    actions: {
      [key: string]: () => void;
    };
  } = {
    isOpen: useStorage('secondaryColumnIsOpen', true),
    isExpanded: useStorage('secondaryColumnIsExpanded', false),
    isExpandable: computed(() => windowWidth.value >= 1202), // secondary column expandable once it has at least 480px of space
    actions: {
      open: () => {
        secondaryColumn.isOpen.value = true;
      },
      close: () => {
        secondaryColumn.isOpen.value = false;
      },
      expand: () => {
        secondaryColumn.isExpanded.value = true;
      },
      collapse: () => {
        secondaryColumn.isExpanded.value = false;
      },
    },
  };

  // properties of the comments column
  const commentsColumn = {
    maxWidth: computed(() => Math.min(windowWidth.value - 722, 600) / 16 + 'rem'), // flexible width of expanded comments column up to 600px
  };

  return {
    colorScheme,
    prioritizedView,
    windowWidth,
    availableColumns,
    secondaryColumn,
    commentsColumn,
  };
});
