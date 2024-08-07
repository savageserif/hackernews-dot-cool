<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <img
          :class="[view.isTouchDevice ? 'mx-1.5 h-7' : 'mx-1 h-6']"
          :src="logoAsset"
        />
      </template>
      <template #center>
        <TheCategorySelect />
      </template>
      <template #right>
        <RefreshButton
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
import { computed } from 'vue';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import RefreshButton from '@/components/RefreshButton.vue';
import ThePostsListColumnBody from '@/components/ThePostsListColumnBody.vue';
import TheCategorySelect from '@/components/TheCategorySelect.vue';
import TheSettingsMenu from '@/components/TheSettingsMenu.vue';
import logoAsset from '@/assets/images/logo.png';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';

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
