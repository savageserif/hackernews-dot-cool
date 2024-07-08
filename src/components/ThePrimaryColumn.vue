<template>
  <PageColumn>
    <PageColumnControls
      :divider="view.availableColumns === 3 && !view.secondaryColumn.isOpen ? 'right' : undefined"
    >
      <template #left>
        <BaseButton
          v-show="view.availableColumns === 1"
          icon="chevron-left"
          @click="router.push({ name: 'no-selection' })"
        />
      </template>
      <template
        #center
        v-if="content.currentPostItem"
      >
        <TheLinkColumnTitle v-if="showLinkColumn" />
        <TheCommentsColumnTitle v-else />
      </template>
      <template
        #right
        v-if="content.currentPostItem && content.currentPostItemHasLinkAndComments"
      >
        <BaseButton
          v-show="view.availableColumns === 3 && !view.secondaryColumn.isOpen"
          :icon="view.prioritizedView === 'link' ? 'comment' : 'link'"
          :title="
            view.prioritizedView === 'link'
              ? `${content.currentPostItem?.descendants} Comments`
              : `Preview of ${content.currentPostItem?.url?.hostname}`
          "
          @click="view.secondaryColumn.actions.open()"
        >
          {{
            view.prioritizedView === 'link'
              ? content.currentPostItem?.descendants
              : content.currentPostItem?.url?.hostname
          }}
        </BaseButton>
      </template>
    </PageColumnControls>

    <PageColumnBody v-if="!content.currentPostItem">
      <StatusItem full-height />
    </PageColumnBody>
    <template v-else-if="view.availableColumns === 3">
      <TheLinkColumnBody v-if="showLinkColumn" />
      <TheCommentsColumnBody v-else />
    </template>
    <template v-else>
      <TheLinkColumnBody v-show="showLinkColumn" />
      <TheCommentsColumnBody v-show="!showLinkColumn" />
    </template>

    <PageColumnControls
      v-if="view.availableColumns <= 2 && content.currentPostItemHasLinkAndComments"
      bottom
      class="@container"
    >
      <template #center>
        <TheUnifiedViewControl />
      </template>
    </PageColumnControls>
  </PageColumn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import StatusItem from '@/components/StatusItem.vue';
import TheLinkColumnTitle from '@/components/TheLinkColumnTitle.vue';
import TheLinkColumnBody from '@/components/TheLinkColumnBody.vue';
import TheCommentsColumnTitle from '@/components/TheCommentsColumnTitle.vue';
import TheCommentsColumnBody from '@/components/TheCommentsColumnBody.vue';
import TheUnifiedViewControl from '@/components/TheUnifiedViewControl.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const router = useRouter();
const view = useViewStore();
const content = useContentStore();

const showLinkColumn = computed(
  () =>
    content.currentPostItemHasLink &&
    ((view.availableColumns === 3 && view.prioritizedView === 'link') ||
      (view.availableColumns <= 2 && view.activeUnifiedColumnView === 'link'))
);
</script>
