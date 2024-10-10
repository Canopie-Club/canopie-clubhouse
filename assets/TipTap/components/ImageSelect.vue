<template>
  <node-view-wrapper>
    <Teleport to="#explorer">
      <div
        @click="explorerOpen = false"
        class="click-off-close"
        :class="{ hiding: !explorerOpen }"
      ></div>
      <div class="explorer-container" :class="{ 'pointer-events-none': !explorerOpen }">
        <Explorer
          v-model:open="explorerOpen"
          site-id="thedukeofnorfolk"
          :confirm-selection="confirmSelection"
          show-footer
          closable
        />
      </div>
    </Teleport>
    <div class="image-select flex relative">
      <img class="rounded-md" v-if="selection" :src="selection" alt="Selected image" />
      <div v-if="selection" @click="addImage" class="change-image">
        <UiButton @click="addImage">Change Image</UiButton>
      </div>
      <UiButton v-if="!selection" class="select-image-button" @click="addImage"
        >Click to Select Image</UiButton
      >
    </div>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
// import { ImageSelector } from "../ImageSelector";
import { ref } from "vue";

const props = defineProps(nodeViewProps);

const addImage = () => {
  explorerOpen.value = true;
};

const explorerOpen = ref(false);
const selection = computed(() => props.node.attrs["tt-src"]);

const confirmSelection = (path: string | null) => {
  // if (path) {
  //   selection.value = path
  // }

  console.log({ src: path });
  props.updateAttributes({ "tt-src": path || "" });

  explorerOpen.value = false;
};
</script>

<style lang="scss" scoped>
.explorer-container {
  width: calc(100% - 3.5rem);
  height: calc(100% - 3.5rem);
  top: 1.75rem;
  left: 1.75rem;
  z-index: 40;

  :deep(*) {
    margin-top: 0 !important;
  }

  @apply fixed;
}

.image-select {
  @apply bg-slate-200 min-h-8 rounded;

  & > * {
    @apply mt-0 !important;
  }

  .change-image {
    @apply absolute top-0 left-0;
    @apply w-full h-full;
    @apply flex items-center justify-center;
    @apply opacity-0 hover:opacity-100;
    @apply transition-opacity duration-300;
    @apply cursor-pointer;
  }

  .select-image-button {
    @apply w-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-600;
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
