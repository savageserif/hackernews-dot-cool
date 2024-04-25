<template>
  <PageColumn>
    <PageColumnControls>
      <template #left>
        <BaseButton icon="column-expand" />
      </template>
      <template #center>245 Comments</template>
      <template #right>
        <BaseButton icon="close" />
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
</script>
