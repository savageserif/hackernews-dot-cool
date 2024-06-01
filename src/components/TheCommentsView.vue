<template>
  <PageColumnBody class="scroll-pt-[2.625rem] space-y-px">
    <template v-if="renderComments">
      <Suspense v-if="content.currentPostItem?.kids && content.currentPostItem.kids.length !== 0">
        <template #default>
          <TheCommentsList />
        </template>
        <template #fallback>
          <LoadingItem full-height />
        </template>
      </Suspense>
      <LoadingItem
        v-else
        full-height
        message="So far, no comments have been left on this story."
      />
    </template>
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import TheCommentsList from '@/components/TheCommentsList.vue';
import LoadingItem from '@/components/LoadingItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const renderComments = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // force comment items to re-render when post item changes
    renderComments.value = false;
    await nextTick();
    renderComments.value = true;
    await nextTick();
  }
);
</script>
