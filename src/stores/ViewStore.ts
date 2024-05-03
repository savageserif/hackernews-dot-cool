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
    isOpen: boolean;
    isExpanded: boolean;
    isExpandable: ComputedRef<boolean>;
    actions: {
      [key: string]: () => void;
    };
  }>({
    isOpen: true,
    isExpanded: false,
    isExpandable: computed(() => width.value >= 1202), // secondary column expandable once it has at least 480px of space
    actions: {
      open: () => {
        secondaryColumn.value.isOpen = true;
      },
      close: () => {
        secondaryColumn.value.isOpen = false;
      },
      expand: () => {
        secondaryColumn.value.isExpanded = true;
      },
      collapse: () => {
        secondaryColumn.value.isExpanded = false;
      },
    },
  });

  const commentsColumn = ref({
    maxWidth: computed(() => Math.min(width.value - 722, 600) / 16 + 'rem'), // flexible width of expanded comments column up to 600px
  });

  return {
    width,
    availableColumns,
    secondaryColumn,
    commentsColumn,
  };
});
