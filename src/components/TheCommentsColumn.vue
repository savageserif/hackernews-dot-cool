<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <BaseButton
          v-if="view.secondaryColumnSize === 'collapsed'"
          icon="column-expand"
          title="Expand Comments"
          @click="view.secondaryColumnSize = 'expanded'"
        />
        <BaseButton
          v-else
          icon="column-collapse"
          title="Collapse Comments"
          @click="view.secondaryColumnSize = 'collapsed'"
        />
      </template>
      <template #center>245 Comments</template>
      <template #right>
        <BaseButton
          icon="close"
          title="Close Comments"
          @click="view.secondaryColumnVisible = false"
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

const view = useViewStore();
</script>
