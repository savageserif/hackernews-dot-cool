import { ref, computed, watchEffect, nextTick } from 'vue';
import { defineStore } from 'pinia';
import {
  useStorage,
  usePreferredDark,
  useWindowSize,
  useMediaQuery,
  useInterval,
} from '@vueuse/core';

export const useViewStore = defineStore('view', () => {
  const colorScheme = useStorage<'system' | 'light' | 'dark'>('colorScheme', 'system');
  const darkColorSchemeIsActive = computed(
    () =>
      colorScheme.value === 'dark' || (colorScheme.value === 'system' && usePreferredDark().value)
  );

  watchEffect(async () => {
    if (darkColorSchemeIsActive.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    await nextTick();

    document.head
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--color-bg-controls')})`
      );
  });

  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const isStandaloneDisplayMode = useMediaQuery('(display-mode: standalone)');
  const { width: windowWidth } = useWindowSize();

  const prioritizedView = useStorage<'link' | 'comments'>('prioritizedView', 'link');

  // number of columns available depending on window width
  const availableColumns = computed((): 1 | 2 | 3 => {
    if (windowWidth.value < 721) return 1;
    else if (windowWidth.value < 1082) return 2;
    else return 3;
  });

  // state/properties of the secondary column
  const secondaryColumn = {
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

  // which view is active within the unified column (availableColumns < 3)
  const activeUnifiedColumnView = useStorage<'link' | 'comments'>(
    'activeUnifiedColumnView',
    'link'
  );

  // state/actions of modal dialogs
  const dialogs = {
    openDialogId: ref<string | undefined>(undefined),
    open: (id: string) => {
      dialogs.openDialogId.value = id;
    },
    close: () => {
      dialogs.openDialogId.value = undefined;
    },
  };

  // ticker which increases every minute to trigger relative timestamp refreshes
  const timestampTicker = useInterval(60000);

  return {
    colorScheme,
    darkColorSchemeIsActive,
    isTouchDevice,
    isStandaloneDisplayMode,
    windowWidth,
    prioritizedView,
    availableColumns,
    secondaryColumn,
    commentsColumn,
    activeUnifiedColumnView,
    dialogs,
    timestampTicker,
  };
});
