<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <img
          class="mx-1 w-10"
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
    <PageColumnBody>
      <ThePostsView />
    </PageColumnBody>
    <PageColumnControls>
      <template #center>
        <span class="mb-px text-small text-gray-500">Last refreshed just now</span>
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
import { storeToRefs } from 'pinia';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import ThePostsView from '@/components/ThePostsView.vue';
import logoAsset from '@/assets/logo.png';
import { useSettingsStore } from '@/stores/SettingsStore';
import { useContentStore } from '@/stores/ContentStore';

const settings = useSettingsStore();
const content = useContentStore();

const { prioritizedView } = storeToRefs(settings);

function togglePrioritizedView() {
  if (prioritizedView.value === 'link') {
    prioritizedView.value = 'comments';
  } else {
    prioritizedView.value = 'link';
  }
}
</script>
