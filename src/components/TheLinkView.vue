<template v-if="url">
  <object
    v-show="!error"
    ref="objectElement"
    class="h-full w-full"
    :data="content.currentItem.url?.href"
  />
  <div
    v-show="error"
    class="flex h-full flex-col items-center justify-center gap-4 bg-gray-100"
  >
    <div class="max-w-150 text-balance px-8 text-center leading-paragraph-narrow text-gray-500">
      Unfortunately, this website does not allow an inline preview. You can open the link externally
      instead.
    </div>
    <BaseButton
      icon="external"
      bordered
      @click="openExternalLink()"
    >
      Open in External Tab
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const objectElement = ref<Element | null>(null);
const error = ref(false);

watch(
  () => content.currentItem,
  () => {
    error.value = false;
  }
);

onMounted(() => {
  objectElement.value?.addEventListener('error', () => {
    error.value = true;
  });
});

function openExternalLink() {
  window.open(content.currentItem.url?.href, '_blank');
}
</script>
