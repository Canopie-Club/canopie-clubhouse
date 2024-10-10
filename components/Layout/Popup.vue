<template>
  <Teleport to="#popup">
    <div
      @click="open = false"
      class="click-off-close"
      :class="{ hiding: !open }"
    ></div>
    <div class="popup-container" :class="{ closed: !open }">
        <div class="popup-window" :class="{ closed: !open }">
          <div class="close-button" @click="open = false">x</div>
          <div class="popup-content">
            <slot />
          </div>
        </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const open = defineModel("open", {
  default: true,
  type: Boolean,
});
</script>

<style lang="scss" scoped>

.popup-container {
  width: calc(100% - 3.5rem);
  height: calc(100% - 3.5rem);
  top: 1.75rem;
  left: 1.75rem;
  z-index: 40;

  :deep(*) {
    margin-top: 0 !important;
  }

  @apply fixed;

  &.closed {
    @apply pointer-events-none;
  }
}

.popup-window {
  @apply w-full h-full border-4 border-gray-200 rounded-lg p-4 relative bg-white;

  .popup-content {
    @apply w-full h-full overflow-y-auto overflow-x-hidden;
  }

  transition-property: opacity transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &.closed {
    // transform: scale(0.8);
    @apply scale-90 opacity-0 pointer-events-none;
  }

  .close-button {
    @apply bg-rose-500 text-white rounded-full border-2 border-solid border-rose-600;
    @apply flex justify-center items-center cursor-pointer;
    @apply absolute w-5 h-5 z-10 -top-3 -right-3;
    @apply font-mono text-xs;
    @apply hover:bg-rose-600 hover:border-rose-700;
  }
}

.click-off-close {
  @apply fixed top-0 left-0 w-full h-full;
  @apply z-20;
  @apply bg-black/50;
  @apply transition-opacity duration-300;
  @apply cursor-pointer;

  &.hiding {
    @apply opacity-0;
    @apply pointer-events-none;
  }
}
</style>
