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
        <TheCommentsColumnTitle v-if="view.prioritizedView === 'link'" />
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
    <TheCommentsColumnBody v-if="view.prioritizedView === 'link'" />
    <TheLinkColumnBody v-else />
  </PageColumn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheLinkColumnTitle from '@/components/TheLinkColumnTitle.vue';
import TheLinkColumnBody from '@/components/TheLinkColumnBody.vue';
import TheCommentsColumnTitle from '@/components/TheCommentsColumnTitle.vue';
import TheCommentsColumnBody from '@/components/TheCommentsColumnBody.vue';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();

const columnName = computed(() => (view.prioritizedView === 'link' ? 'Comments' : 'Link Preview'));
</script>
