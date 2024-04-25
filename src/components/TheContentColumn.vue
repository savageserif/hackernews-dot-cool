<template>
  <PageColumn>
    <PageColumnControls>
      <template #center>
        <span>
          <span>ia.net</span>
          <span class="text-gray-500">/topics/ia-writer-in-paper</span>
        </span>
        <BaseButton
          icon="external"
          small
          title="Open in External Tab"
          @click="openExternalPage()"
        />
      </template>
    </PageColumnControls>
    <PageColumnBody>
      <object
        ref="objectElement"
        class="h-full w-full"
        :data="currentUrl"
      />
    </PageColumnBody>
  </PageColumn>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';

const currentUrl = ref('https://ia.net/topics/ia-writer-in-paper');

function openExternalPage() {
  window.open(currentUrl.value, '_blank');
}

const objectElement = ref<Element | null>(null);

onMounted(() => {
  objectElement.value?.addEventListener('load', () => {
    console.log('object loaded');
  });

  objectElement.value?.addEventListener('error', () => {
    console.log('error loading object');
  });
});
</script>
