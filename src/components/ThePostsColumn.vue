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
        <BaseButton>Top Stories</BaseButton>
      </template>
      <template #right>
        <BaseButton icon="refresh" />
      </template>
    </PageColumnControls>
    <PageColumnBody></PageColumnBody>
    <PageColumnControls>
      <template #center>
        <span class="mb-px text-small text-gray-500">
          Last updated 4 minutes ago
        </span>
      </template>
      <template #right>
        <BaseButton icon="settings" />
      </template>
    </PageColumnControls>
  </PageColumn>
</template>

<script setup lang="ts">
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';

import logoAsset from '@/assets/logo.png';
</script>
