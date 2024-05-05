<template>
  <div
    class="pl-6 pr-3"
    :class="[
      viewed && !active ? 'text-gray-600' : '',
      active ? 'shadow-border-y bg-orange-200 text-orange-950 shadow-orange-200' : 'cursor-pointer',
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
          icon="upvote"
          small
          inherit-color
        >
          {{ item.score }}
        </BaseLabel>
        <BaseLabel
          icon="clock"
          small
          inherit-color
        >
          {{ item.time }}
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

const props = defineProps<{
  item: HackerNewsItem;
  viewed?: boolean;
  active?: boolean;
}>();
</script>
