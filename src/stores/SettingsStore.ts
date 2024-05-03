import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  const prioritizedView = useStorage<'link' | 'comments'>('prioritizedView', 'link');
  const colorScheme = useStorage<'light' | 'dark' | 'system'>('colorScheme', 'system');

  return {
    prioritizedView,
    colorScheme,
  };
});
