<template>
  <PageColumn>
    <PageColumnControls
      :divider="view.availableColumns >= 3 && !view.secondaryColumn.isOpen ? 'right' : undefined"
    >
      <template #center>
        <TheLinkColumnTitle v-if="view.prioritizedView === 'link'" />
        <TheCommentsColumnTitle v-else />
      </template>
      <template #right>
        <BaseButton
          v-show="view.availableColumns >= 3 && !view.secondaryColumn.isOpen"
          :icon="view.prioritizedView === 'link' ? 'comment' : 'link'"
          :title="
            view.prioritizedView === 'link'
              ? `${content.currentPostItem?.descendants} Comments`
              : `Preview of ${content.currentPostItem?.url?.hostname}`
          "
          @click="view.secondaryColumn.actions.open()"
        >
          {{
            view.prioritizedView === 'link'
              ? content.currentPostItem?.descendants
              : content.currentPostItem?.url?.hostname
          }}
        </BaseButton>
      </template>
    </PageColumnControls>
    <TheLinkView v-if="view.prioritizedView === 'link'" />
    <TheCommentsView v-else />
  </PageColumn>
</template>

<script setup lang="ts">
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheLinkColumnTitle from '@/components/TheLinkColumnTitle.vue';
import TheLinkView from '@/components/TheLinkView.vue';
import TheCommentsColumnTitle from '@/components/TheCommentsColumnTitle.vue';
import TheCommentsView from '@/components/TheCommentsView.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();
</script>
