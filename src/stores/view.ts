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

  const objectErrorEventsSupported = ref(true);

  addEventListener('object-error-events-unsupported', () => {
    objectErrorEventsSupported.value = false;
  });

  // test support for object tag error events by attempting to embed a URL with the
  // X-Frame-Options: DENY header; if this does not result in an error event,
  // the 'object-error-events-unsupported' event is dispatched
  testObjectErrorEventsSupport();

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
    isExpandable: computed(() =>
      // expandable once secondary column can grow to at least 480px of space;
      // different thresholds depending on whether it contains comments or link
      prioritizedView.value === 'link' ? windowWidth.value >= 1202 : windowWidth.value >= 1562
    ),
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
    objectErrorEventsSupported,
    isTouchDevice,
    isStandaloneDisplayMode,
    windowWidth,
    prioritizedView,
    availableColumns,
    secondaryColumn,
    activeUnifiedColumnView,
    dialogs,
    timestampTicker,
  };
});
