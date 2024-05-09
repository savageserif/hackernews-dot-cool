import { ref, watch, toValue, isRef } from 'vue';
import type { Ref } from 'vue';
import { useViewStore } from '@/stores/ViewStore';

export function useRelativeTimestamp(time?: number | Ref<number | undefined>, capitalized = false) {
  const view = useViewStore();

  const relativeTimestampText = (past?: number) => {
    if (past === undefined) return undefined;

    const present = Math.floor(Date.now() / 1000);
    const difference = present - past;

    if (difference < 60) {
      return capitalized ? 'Just now' : 'just now';
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
  };

  const text = ref(relativeTimestampText(toValue(time)));

  // refresh text when either the time argument changes or the global interval ticker counts up
  watch(
    () => [isRef(time) ? time.value : undefined, view.timestampTicker],
    () => {
      text.value = relativeTimestampText(toValue(time));
    }
  );

  return { text };
}
