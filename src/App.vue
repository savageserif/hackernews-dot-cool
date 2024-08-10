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
</template>

<script setup lang="ts">
const view = useViewStore();
const content = useContentStore();
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
</script>

<style lang="postcss">
body {
  @apply touch-manipulation select-none bg-separator-color font-sans text-base text-primary-color antialiased selection:bg-selection-color selection:text-primary-selected-color;
}
</style>
