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
const view = useViewStore();

const columnName = computed(() => (view.prioritizedView === 'link' ? 'Comments' : 'Link Preview'));
</script>
