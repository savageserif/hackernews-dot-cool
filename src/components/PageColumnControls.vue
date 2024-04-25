<template>
  <div class="flex h-10 flex-initial items-center gap-2 bg-gray-100 p-1">
    <div class="flex flex-1 items-center gap-0.5">
      <slot name="left" />
    </div>
    <div class="flex items-center gap-0.5">
      <slot name="center" />
    </div>
    <div class="flex flex-1 items-center justify-end gap-0.5">
      <slot name="right" />
    </div>
  </div>
</template>
