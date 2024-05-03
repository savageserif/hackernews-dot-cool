<template>
  <PageColumn>
    <PageColumnControls :divider="!view.secondaryColumn.open ? 'right' : undefined">
      <template #center>
        <span>
          <span>
            {{ content.currentUrl.hostname }}
          </span>
          <span
            v-if="content.currentUrl.pathname !== '/'"
            class="text-gray-500"
          >
            {{ content.currentUrl.pathname }}
          </span>
        </span>
        <BaseButton
          icon="external"
          small
          title="Open in External Tab"
          @click="openExternalLink()"
        />
      </template>
      <template #right>
        <BaseButton
          v-show="!view.secondaryColumn.open"
          icon="comment"
          :title="content.currentItem.descendants + ' Comments'"
          @click="view.secondaryColumn.actions.open()"
        >
          {{ content.currentItem.descendants }}
        </BaseButton>
      </template>
    </PageColumnControls>
    <PageColumnBody>
      <TheLinkView :url="content.currentUrl.href" />
    </PageColumnBody>
  </PageColumn>
</template>

<script setup lang="ts">
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheLinkView from '@/components/TheLinkView.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();

function openExternalLink() {
  window.open(content.currentUrl.href, '_blank');
}
</script>
