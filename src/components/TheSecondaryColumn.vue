<template>
  <PageColumn>
    <PageColumnControls>
      <template
        #left
        v-if="view.secondaryColumn.isExpandable"
      >
        <BaseButton
          v-show="!view.secondaryColumn.isExpanded"
          icon="column-expand"
          :title="`Expand ${columnName}`"
          @click="view.secondaryColumn.actions.expand()"
        />
        <BaseButton
          v-show="view.secondaryColumn.isExpanded"
          icon="column-collapse"
          :title="`Collapse ${columnName}`"
          @click="view.secondaryColumn.actions.collapse()"
        />
      </template>
      <template #center>
        <template v-if="settings.prioritizedView === 'link'">
          {{ content.currentPostItem?.descendants }} Comments
        </template>
        <TheLinkColumnTitle v-else />
      </template>
      <template #right>
        <BaseButton
          icon="close"
          :title="`Close ${columnName}`"
          @click="view.secondaryColumn.actions.close()"
        />
      </template>
    </PageColumnControls>
    <TheCommentsView v-if="settings.prioritizedView === 'link'" />
    <TheLinkView v-else />
  </PageColumn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
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

const columnName = computed(() =>
  settings.prioritizedView === 'link' ? 'Comments' : 'Link Preview'
);
</script>
