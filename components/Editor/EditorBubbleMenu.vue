<template>
  <div class="bubble-menu-container">
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="bubble-menu"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        B
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <em>I</em>
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
      >
        <span class="underline">U</span>
      </button>

      <button @click="toggleLink" :class="{ 'is-active': editor.isActive('link') }">
        <Icon name="heroicons:link" class="h-4 w-4" />
      </button>
      <button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        <span class="monospace"><></span>
      </button>
    </BubbleMenu>

    <EditorLinkDialog ref="linkDialog" />
  </div>
</template>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3'
import { type Editor } from '@tiptap/core'
import { ref } from 'vue'
import EditorLinkDialog from './EditorLinkDialog.vue'

const props = defineProps<{
  editor?: Editor
}>()

const linkDialog = ref<InstanceType<typeof EditorLinkDialog> | null>(null)

const toggleLink = async () => {
  if (props.editor?.isActive('link')) {
    props.editor?.chain().focus().unsetLink().run()
  } else {
    const url = await linkDialog.value?.getLinkUrl()
    if (url && url !== '') {
      props.editor?.chain().focus().setLink({ href: url }).run()
    }
  }
}
</script>

<style lang="scss" scoped>
.bubble-menu-container {
  // @apply z-50;
  :deep(div[data-tippy-root]) {
    background: red !important;
    @apply z-50;
  }
}

.bubble-menu {
  @apply flex bg-slate-200 rounded-lg;

  button {
    @apply border-none bg-transparent;
    @apply text-slate-800 text-sm font-medium;
    @apply py-1.5 px-1.5;
    @apply opacity-60 transition-opacity duration-200;

    &:hover,
    &.is-active {
      @apply opacity-100 bg-slate-300;
    }

    &:first-child {
      @apply rounded-l-lg pl-2;
    }

    &:last-child {
      @apply rounded-r-lg pr-2;
    }
  }
}
</style>
