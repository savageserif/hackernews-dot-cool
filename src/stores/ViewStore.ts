import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useWindowSize } from '@vueuse/core';

export const useViewStore = defineStore('view', () => {
  const { width } = useWindowSize();

  const availableColumns = computed((): 1 | 2 | 3 => {
    if (width.value < 721) return 1;
    else if (width.value < 1082) return 2;
    else return 3;
  });

  // secondary column expandable once it has at least 480px of space
  const secondaryColumnExpandable = computed(() => width.value >= 1202);
  // flexible width of expanded secondary column up to 600px (150tw / 37.5rem)
  const secondaryColumnExpandedWidth = computed(
    () => Math.min(width.value - 722, 600) / 16 + 'rem'
  );

  const secondaryColumnVisible = ref(true);
  const secondaryColumnSize = ref<'collapsed' | 'expanded'>('collapsed');

  return {
    availableColumns,
    secondaryColumnExpandable,
    secondaryColumnExpandedWidth,
    secondaryColumnVisible,
    secondaryColumnSize,
  };
});
