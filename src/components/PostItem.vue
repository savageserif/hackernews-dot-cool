<template>
  <div
    class="px-3.5"
    :class="[
      active
        ? 'shadow-border-y bg-orange-200 text-orange-950 shadow-orange-200'
        : 'cursor-pointer hover:bg-gray-50',
      viewed && !active ? 'text-gray-500' : '',
    ]"
  >
    <div
      class="space-y-2 pb-3 pt-2.5"
      :class="[!active ? 'shadow-border-b shadow-gray-200' : '']"
    >
      <div class="font-serif space-y-0.5 text-base-serif">
        <h2 class="font-serif-heading font-bold">
          {{ smartquotes(item.title) }}
        </h2>
        <div>
          {{ item.url?.hostname }}
          <span
            class="italic"
            :class="[
              viewed && !active ? 'text-gray-500/70' : '',
              active ? 'text-orange-950/60' : 'text-gray-500',
            ]"
          >
            via&nbsp;{{ item.by }}
          </span>
        </div>
      </div>
      <div
        class="ml-[-0.125rem] flex gap-2.5"
        :class="[active ? 'text-orange-950/60' : 'text-gray-500']"
      >
        <BaseLabel
          v-if="item.score !== undefined"
          icon="upvote"
          small
          inherit-color
        >
          {{ item.score }}
        </BaseLabel>
        <BaseLabel
          v-if="item.time !== undefined"
          icon="clock"
          small
          inherit-color
          :title="absoluteTimestamp"
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
          {{ item.descendants }}
        </BaseLabel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import smartquotes from 'smartquotes-ts';
import type { HackerNewsItem } from '@/types';
import BaseLabel from '@/components/BaseLabel.vue';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';

const props = defineProps<{
  item: HackerNewsItem;
  viewed?: boolean;
  active?: boolean;
}>();

const { text: relativeTimestamp } = useRelativeTimestamp(props.item.time, true);

const absoluteTimestamp = props.item.time
  ? new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(props.item.time * 1000)
  : '';
</script>
