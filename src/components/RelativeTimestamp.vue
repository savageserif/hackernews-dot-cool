<template>
  {{ text }}
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();

const props = defineProps<{
  timestamp: number;
  capitalized?: boolean;
}>();

function relativeTimestampText(past: number) {
  const present = Math.floor(Date.now() / 1000);
  const difference = present - past;

  if (difference < 60) {
    return props.capitalized ? 'Just now' : 'just now';
  } else if (difference < 3600) {
    const minutes = Math.floor(difference / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (difference < 86400) {
    const hours = Math.floor(difference / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (difference < 2620800) {
    const days = Math.floor(difference / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (difference < 31449600) {
    const months = Math.floor(difference / 2620800);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(difference / 31449600);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}

const text = ref(relativeTimestampText(props.timestamp));

// refresh text when either the timestamp prop changes or the global interval ticker counts up
watch(
  () => [props.timestamp, view.timestampTicker],
  () => {
    text.value = relativeTimestampText(props.timestamp);
  }
);
</script>
