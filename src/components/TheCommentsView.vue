<template>
  <PageColumnBody class="space-y-px">
    <template v-if="commentsRendered">
      <Suspense v-if="content.currentPostItem?.kids && content.currentPostItem.kids.length !== 0">
        <CommentItem
          v-for="(commentId, index) in content.currentPostItem.kids"
          :key="index"
          :id="commentId"
          :level="0"
          :first-of-level="index === 0"
          :last-of-level="false"
          :consecutive-last-levels="0"
          :post-by="content.currentPostItem.by"
        />
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
import CommentItem from '@/components/CommentItem.vue';
import LoadingItem from '@/components/LoadingItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const commentsRendered = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // force comment items to re-render when post item changes
    commentsRendered.value = false;
    await nextTick();
    commentsRendered.value = true;
    await nextTick();
  }
);
</script>
