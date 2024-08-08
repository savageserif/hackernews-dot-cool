<template>
  <div
    class="px-3.5"
    :class="[
      active
        ? 'bg-selection-color text-primary-selected-color shadow-border-y shadow-selection-color'
        : 'cursor-pointer',
      !active && !view.isTouchDevice ? 'hover:bg-hover-color' : '',
      viewed && !active ? 'text-secondary-color' : '',
    ]"
  >
    <div
      class="space-y-2 pb-3 pt-2.5"
      :class="[!active ? 'shadow-border-b shadow-separator-color' : '']"
    >
      <div class="space-y-0.5 font-serif text-base-serif">
        <h2 class="font-serif-heading font-bold">
          {{ avoidShortWidows(smartquotes(item.title)) }}
        </h2>
        <div class="[overflow-wrap:anywhere]">
          {{ item.url?.hostname }}
          <span
            class="italic"
            :class="[
              viewed && !active ? 'text-secondary-color/70' : '',
              active ? 'text-primary-selected-color/60' : 'text-secondary-color',
            ]"
          >
            {{ item.url ? 'via' : 'by' }}&nbsp;{{ item.by }}
          </span>
        </div>
      </div>
      <div
        class="ml-[-0.125rem] flex gap-2.5"
        :class="[active ? 'text-primary-selected-color/60' : 'text-secondary-color']"
      >
        <BaseLabel
          v-if="item.score !== undefined"
          icon="upvote"
          small
          inherit-color
        >
          {{ formatNumber(item.score) }}
        </BaseLabel>
        <BaseLabel
          v-if="item.time !== undefined"
          icon="clock"
          small
          inherit-color
          :title="absoluteTimestamp(props.item.time)"
        >
          {{ relativeTimestamp }}
        </BaseLabel>
        <BaseLabel
          v-if="item.descendants !== undefined"
          class="ml-auto"
          icon="comment"
          small
          inherit-color
        >
          {{ formatNumber(item.descendants) }}
        </BaseLabel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import smartquotes from 'smartquotes-ts';
import type { HackerNewsItem } from '@/types';
import { avoidShortWidows } from '@/utils/avoidShortWidows';
import { formatNumber } from '@/utils/formatNumber';
import { absoluteTimestamp } from '@/utils/absoluteTimestamp';
import BaseLabel from '@/components/BaseLabel.vue';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';
import { useViewStore } from '@/stores/ViewStore';

const props = defineProps<{
  item: HackerNewsItem;
  viewed?: boolean;
  active?: boolean;
}>();

const view = useViewStore();

const { text: relativeTimestamp } = useRelativeTimestamp(props.item.time, true);
</script>
