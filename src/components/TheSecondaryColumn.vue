<template>
  <PageColumn>
    <PageColumnControls>
      <template
        #left
        v-if="view.secondaryColumn.expandable"
      >
        <BaseButton
          v-show="!view.secondaryColumn.expanded"
          icon="column-expand"
          title="Expand Comments"
          @click="view.secondaryColumn.actions.expand()"
        />
        <BaseButton
          v-show="view.secondaryColumn.expanded"
          icon="column-collapse"
          title="Collapse Comments"
          @click="view.secondaryColumn.actions.collapse()"
        />
      </template>
      <template #center>{{ content.currentItem.descendants }} Comments</template>
      <template #right>
        <BaseButton
          icon="close"
          title="Close Comments"
          @click="view.secondaryColumn.actions.close()"
        />
      </template>
    </PageColumnControls>
    <PageColumnBody></PageColumnBody>
  </PageColumn>
</template>

<script setup lang="ts">
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();
</script>
