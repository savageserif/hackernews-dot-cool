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
        <BaseButton>{{ content.currentCategoryName }}</BaseButton>
      </template>
      <template #right>
        <BaseButton
          icon="refresh"
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
          class="mb-px text-small text-gray-500"
        >
          <template
            v-if="
              content.currentCategoryPostIds.isLoading ||
              (!content.currentCategoryHasSomePostItems &&
                content.currentCategoryPostItems?.isLoading)
            "
          >
            Loading stories…
          </template>
          <template v-else>Last refreshed {{ refreshTimestamp }}</template>
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
import ThePostsView from '@/components/ThePostsView.vue';
import logoAsset from '@/assets/logo.png';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';

const view = useViewStore();
const content = useContentStore();

const { text: refreshTimestamp } = useRelativeTimestamp(
  computed(() => content.currentCategoryPostIds?.timestamp)
);

const { prioritizedView } = storeToRefs(view);

function togglePrioritizedView() {
  if (prioritizedView.value === 'link') {
    prioritizedView.value = 'comments';
  } else {
    prioritizedView.value = 'link';
  }
}
</script>
