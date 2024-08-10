<template>
  {{ formatNumberWithLabel(content.currentPostItem?.descendants, 'Comment') }}
</template>

<script setup lang="ts">
import { formatNumberWithLabel } from '@/utils/formatNumberWithLabel';

const content = useContentStore();
</script>
