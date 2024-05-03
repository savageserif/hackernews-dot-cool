<template>
  <PageColumn>
    <PageColumnControls
      :divider="view.availableColumns >= 3 && !view.secondaryColumn.isOpen ? 'right' : undefined"
    >
      <template #center>
        <TheLinkColumnTitle v-if="settings.prioritizedView === 'link'" />
        <template v-else>{{ content.currentItem.descendants }} Comments</template>
      </template>
      <template #right>
        <BaseButton
          v-if="settings.prioritizedView === 'link'"
          v-show="view.availableColumns >= 3 && !view.secondaryColumn.isOpen"
          icon="comment"
          :title="content.currentItem.descendants + ' Comments'"
          @click="view.secondaryColumn.actions.open()"
        >
          {{ content.currentItem.descendants }}
        </BaseButton>
        <BaseButton
          v-else
          v-show="view.availableColumns >= 3 && !view.secondaryColumn.isOpen"
          icon="link"
          :title="`Preview of ${content.currentItem.url?.hostname}`"
          @click="view.secondaryColumn.actions.open()"
        >
          {{ content.currentItem.url?.hostname }}
        </BaseButton>
      </template>
    </PageColumnControls>
    <PageColumnBody>
      <TheLinkView v-if="settings.prioritizedView === 'link'" />
      <TheCommentsView v-else />
    </PageColumnBody>
  </PageColumn>
</template>

<script setup lang="ts">
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheLinkColumnTitle from '@/components/TheLinkColumnTitle.vue';
import TheLinkView from '@/components/TheLinkView.vue';
import TheCommentsView from '@/components/TheCommentsView.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useSettingsStore } from '@/stores/SettingsStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const settings = useSettingsStore();
const content = useContentStore();

function openExternalLink() {
  window.open(content.currentItem.url?.href, '_blank');
}
</script>
