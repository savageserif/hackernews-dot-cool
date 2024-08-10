<template>
  {{ formatNumber(content.currentPostItem?.descendants) }} Comment{{
    content.currentPostItem?.descendants !== 1 ? 's' : ''
  }}
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber';

const content = useContentStore();
</script>
