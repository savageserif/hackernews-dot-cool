<template>
  {{ formatNumberWithLabel(content.currentPostItem?.descendants, 'Comment') }}
</template>

<script setup lang="ts">
import { formatNumberWithLabel } from '@/utils/formatting';

const content = useContentStore();
</script>
