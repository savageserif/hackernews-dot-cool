import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useViewStore = defineStore('view', () => {
  const secondaryColumnVisible = ref(true);
  const secondaryColumnSize = ref<'collapsed' | 'expanded'>('collapsed');

  return {
    secondaryColumnVisible,
    secondaryColumnSize,
  };
});
