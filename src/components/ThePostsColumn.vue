<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <img
          class="mx-1 h-6"
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
    <ThePostsView />
    <PageColumnControls>
      <template #center>
        <span
          v-if="content.currentCategoryPostIds"
          class="mb-0.5 text-small text-gray-500"
        >
          {{ refreshStatus }}
        </span>
      </template>
      <template #right>
        <BaseButton
          icon="settings"
          @click="togglePrioritizedView()"
        />
      </template>
    </PageColumnControls>
  </PageColumn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import BaseButton from '@/components/BaseButton.vue';
import RefreshButton from '@/components/RefreshButton.vue';
import ThePostsView from '@/components/ThePostsView.vue';
import TheCategorySelect from '@/components/TheCategorySelect.vue';
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

const { prioritizedView } = storeToRefs(view);

function togglePrioritizedView() {
  if (prioritizedView.value === 'link') {
    prioritizedView.value = 'comments';
  } else {
    prioritizedView.value = 'link';
  }
}
</script>
