<template>
  <Dialog
    :open="dialogIsOpen"
    class="relative z-30"
    @close="view.dialogs.close()"
  >
    <div
      class="fixed inset-0 bg-primary-color/75 dark:bg-[#111]/85"
      aria-hidden="true"
    />
    <div class="fixed inset-0 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-center justify-center p-2"
        :class="[
          view.isStandaloneDisplayMode ? 'pb-[calc(0.5rem+env(safe-area-inset-bottom))]' : '',
        ]"
      >
        <DialogPanel
          class="rounded-dialog shadow-dialog relative w-full max-w-150 select-text space-y-3 bg-blank-color p-5 font-serif text-base-serif leading-paragraph-wide dark:bg-controls-color"
        >
          <DialogTitle class="font-serif-heading text-[1.5rem] font-bold">{{ title }}</DialogTitle>
          <slot />
          <BaseButton
            icon="close"
            class="absolute right-2 top-2 !m-0"
            @click="view.dialogs.close()"
          />
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import BaseButton from '@/components/BaseButton.vue';
import { useViewStore } from '@/stores/ViewStore';

const props = defineProps<{
  id: string;
  title: string;
}>();

const view = useViewStore();

const dialogIsOpen = computed(() => view.dialogs.openDialogId === props.id);
</script>

<style lang="postcss">
div[class*='rounded-dialog'] h3 {
  @apply !mt-6 font-bold;
}
</style>
