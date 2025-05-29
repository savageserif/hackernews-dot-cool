<template>
  <main
    class="flex h-dvh gap-px"
    :class="[
      view.isStandaloneDisplayMode
        ? 'pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
        : '',
    ]"
  >
    <ThePostsListColumn
      v-show="view.availableColumns >= 2 || route.name === 'no-selection'"
      :class="[view.availableColumns === 1 ? 'flex-1' : 'flex-none basis-90']"
    />
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
  <BaseSVGFilters />
</template>

<script setup lang="ts">
const view = useViewStore();
const content = useContentStore();
const router = useRouter();
const route = useRoute();

content.fetchPostIds();

// update page title to match current route and post item
watchEffect(() => {
  if (route.name === 'post' && content.currentPostItem) {
    document.title = `${content.currentPostItem.title} · Hacker News`;
  } else {
    document.title = `${content.currentCategoryName} · Hacker News`;
  }
});

const telemetryDeckAppId = import.meta.env.VITE_TELEMETRYDECK_APP_ID;
const telemetryDeckTestMode = window.location.hostname !== 'hackernews.cool';

// send a page view signal to TelemetryDeck after each route change
router.afterEach(() => {
  fetch('https://nom.telemetrydeck.com/v2/w/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appID: telemetryDeckAppId,
      isTestMode: telemetryDeckTestMode,
      telemetryClientVersion: 'WebSDK 1.1.0',
      url: window.location.href,
      referrer: document.referrer,
      locale: navigator.language,
    }),
  });
});
</script>

<style lang="postcss">
body {
  @apply touch-manipulation select-none overflow-hidden bg-separator-color font-sans text-base text-primary-color antialiased selection:bg-selection-color selection:text-primary-selected-color;
}
</style>
