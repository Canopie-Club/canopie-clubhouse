<template>
  <!-- <div> -->
  <div
    ref="imageContainer"
    class="image-container cursor-pointer relative rounded"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div
      class="image w-full h-28 bg-cover bg-center bg-slate-300 rounded"
      :style="{ backgroundImage: `url(/_f/${encodedPath})` }"
    />
    <div class="overlay rounded" />
    <div class="selected-border rounded">
      <div class="inner-border"></div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
import type { BlobObject } from '@nuxthub/core'

const props = defineProps<{
  file: BlobObject
  id: string
}>()

const encodedPath = computed(() => {
  const pathParts = props.file.pathname.split('/')
  return pathParts.map(part => encodeURIComponent(part)).join('/')
})

const emit = defineEmits(['dragstart', 'dragend'])

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', props.id)
    event.dataTransfer.effectAllowed = 'move'
  }
  emit('dragstart', props.id)
}

const onDragEnd = () => {
  emit('dragend', props.id)
}
</script>

<style lang="scss" scoped>
.image-container {
  @apply relative;

  .selected-border,
  .overlay {
    @apply absolute top-0 left-0 w-full h-full opacity-0;
    transition: opacity 0.2s ease-in-out;
  }

  .overlay {
    // background-color: rgba(0, 0, 0, 0.5);

    @apply hover:opacity-100 bg-black bg-opacity-20;
  }

  .selected-border {
    border-width: 4px;
    @apply bg-none border-amber-300 pointer-events-none;

    .inner-border {
      @apply absolute top-0 left-0 w-full h-full border-amber-50 border;
    }
  }

  &.dragging {
    // @apply opacity-100;
    @apply fixed;
    // @apply bg-blue-500;
    // width: v-bind(fixedWidth);
    // height: v-bind(fixedHeight);
    z-index: 1000;

    .overlay {
      @apply opacity-0;
    }
  }

  &.selected {
    .selected-border {
      @apply opacity-100;
    }
    // box-shadow: inset 0 0 0 4px theme('colors.blue.500');
    // @apply border-4 border-blue-500;
    // box-sizing: border-box;
    // .image,
    // .overlay {
    //   @apply border-4 border-blue-500;
    // }
  }
}
</style>
