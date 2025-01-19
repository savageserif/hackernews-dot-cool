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
              ? formatNumber(content.currentPostItem?.descendants)
              : content.currentPostItem?.url?.hostname
          }}
        </BaseButton>
      </template>
    </PageColumnControls>

    <PageColumnBody v-if="!content.currentPostItem">
      <BaseStatusIndicator full-height />
    </PageColumnBody>
    <template v-else-if="view.availableColumns === 3">
      <TheLinkColumnBody v-if="showLinkColumn" />
      <TheCommentsColumnBody v-else />
    </template>
    <div
      v-else
      class="relative flex flex-1 overflow-hidden bg-blank-color"
    >
      <TheLinkColumnBody
        class="transition-transform duration-[250ms]"
        :class="[!showLinkColumn ? '-translate-x-full' : '']"
      />
      <TheCommentsColumnBody
        class="absolute inset-0 transition-transform duration-[250ms]"
        :class="[showLinkColumn ? 'translate-x-full' : '']"
      />
    </div>

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
import { formatNumber } from '@/utils/formatting';

const view = useViewStore();
const content = useContentStore();
const router = useRouter();

const showLinkColumn = computed(
  () =>
    !content.currentPostItemHasComments ||
    (content.currentPostItemHasLink &&
      ((view.availableColumns === 3 && view.prioritizedView === 'link') ||
        (view.availableColumns <= 2 && view.activeUnifiedColumnView === 'link')))
);
</script>
