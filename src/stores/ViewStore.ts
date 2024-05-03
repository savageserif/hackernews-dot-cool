import { ref, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { useWindowSize } from '@vueuse/core';

export const useViewStore = defineStore('view', () => {
  const { width } = useWindowSize();

  const availableColumns = computed((): 1 | 2 | 3 => {
    if (width.value < 721) return 1;
    else if (width.value < 1082) return 2;
    else return 3;
  });

  const secondaryColumn = ref<{
    open: boolean;
    expanded: boolean;
    expandable: ComputedRef<boolean>;
    expandedWidth: ComputedRef<string>;
    actions: {
      [key: string]: () => void;
    };
  }>({
    open: true,
    expanded: false,
    expandable: computed(() => width.value >= 1202), // secondary column expandable once it has at least 480px of space
    expandedWidth: computed(() => Math.min(width.value - 722, 600) / 16 + 'rem'), // flexible width of expanded secondary column up to 600px (150tw / 37.5rem)
    actions: {
      open: () => {
        secondaryColumn.value.open = true;
      },
      close: () => {
        secondaryColumn.value.open = false;
      },
      expand: () => {
        secondaryColumn.value.expanded = true;
      },
      collapse: () => {
        secondaryColumn.value.expanded = false;
      },
    },
  });

  return {
    width,
    availableColumns,
    secondaryColumn,
  };
});
