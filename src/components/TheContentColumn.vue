<template>
  <PageColumn>
    <PageColumnControls :divider="!view.secondaryColumnVisible ? 'right' : undefined">
      <template #center>
        <span>
          <span>
            {{ url.hostname }}
          </span>
          <span
            v-if="url.pathname !== '/'"
            class="text-gray-500"
          >
            {{ url.pathname }}
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
          v-show="!view.secondaryColumnVisible"
          icon="comment"
          title="245 Comments"
          @click="view.secondaryColumnVisible = true"
        >
          245
        </BaseButton>
      </template>
    </PageColumnControls>
    <PageColumnBody>
      <TheExternalContent :url="url.href" />
    </PageColumnBody>
  </PageColumn>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PageColumn from '@/components/PageColumn.vue';
import PageColumnControls from '@/components/PageColumnControls.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheExternalContent from '@/components/TheExternalContent.vue';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();

const link = ref('https://ia.net/topics/ia-writer-in-paper');
const url = computed(() => new URL(link.value));

function openExternalLink() {
  window.open(url.value.href, '_blank');
}
</script>
