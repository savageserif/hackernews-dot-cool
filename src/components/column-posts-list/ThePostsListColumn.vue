<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <TheHeaderLogo />
      </template>
      <template #center>
        <TheCategorySelect />
      </template>
      <template #right>
        <TheRefreshButton
          :title="`Refresh ${content.currentCategoryName}`"
          @click="content.fetchPostIds()"
        />
      </template>
    </PageColumnControls>
    <ThePostsListColumnBody />
    <PageColumnControls bottom>
      <template #center>
        <span
          v-if="content.currentCategoryPostIds"
          class="mb-0.5 text-small text-secondary-color"
        >
          {{ refreshStatus }}
        </span>
      </template>
      <template #right>
        <TheSettingsMenu />
      </template>
    </PageColumnControls>
  </PageColumn>
</template>

<script setup lang="ts">
const view = useViewStore();
const content = useContentStore();

const { text: refreshTimestamp } = useRelativeTimestamp(
  computed(() => content.currentCategoryPostIds?.time)
);

const refreshStatus = computed(() => {
  if (
    content.currentCategoryPostIds?.isLoading ||
    (!content.currentCategoryHasSomePostItems && content.currentCategoryPostItems?.isLoading)
  ) {
    return 'Loading stories…';
  } else if (content.currentCategoryPostIds?.error) {
    return '';
  } else {
    return `Last refreshed ${refreshTimestamp.value}`;
  }
});
</script>
