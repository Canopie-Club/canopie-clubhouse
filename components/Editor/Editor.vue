<template>
  <div class="editor-container tiptap">
    <EditorMenuBar :editor="editor" :text-is-selected="textIsSelected" />
    <!-- TODO: Fix issue where drag handle is visible outside of scrollable area -->
    <EditorContent
      :editor="editor"
      class="editor-content"
      :style="{ maxHeight: maxHeight }"
      :class="{
        'border border-gray-200 rounded-md p-4 overflow-y-auto':
          bordered,
      }"
    />
    <EditorBubbleMenu :editor="editor" />

    <!-- <floating-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
      <div class="floating-menu">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          Bullet list
        </button>
      </div>
    </floating-menu> -->
  </div>
</template>

<script setup lang="ts">
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/vue-3";
import Image from "@tiptap/extension-image";
import { SoftBreak } from "../../assets/TipTap/SoftBreak";
import { CustomEnterBehavior } from "../../assets/TipTap/CustomEnterBehavior";
import { ImageSelector } from "~/assets/TipTap/ImageSelector";
import Placeholder from "@tiptap/extension-placeholder";

import DragHandle from "@tiptap-pro/extension-drag-handle";
import NodeRange from "@tiptap-pro/extension-node-range";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'

type ContentType<T extends "json" | "html"> = T extends "json"
  ? JSONContent
  : string;

const props = withDefaults(
  defineProps<{
    contentMode?: "json" | "html";
    bordered?: boolean;
    maxHeight?: string;
  }>(),
  {
    contentMode: "json",
    bordered: false,
    maxHeight: "500px",
  }
);

const model = defineModel<ContentType<typeof props.contentMode>>({
  required: true,
  default: "" as ContentType<typeof props.contentMode>,
});

const updateEditorContent = (content: JSONContent | string) => {
  const isSame =
    typeof content === "string"
      ? content === editor.value?.getHTML()
      : JSON.stringify(content) === JSON.stringify(editor.value?.getJSON());

  if (isSame) return;

  editor.value?.commands.setContent(content);
};

const getContent = () => {
  return props.contentMode === "json"
    ? editor.value?.getJSON()
    : editor.value?.getHTML();
};

defineExpose({
  getContent,
});

watch(model, (value) => {
  updateEditorContent(value);
});

const textIsSelected = ref<boolean>(false);

const editor = useEditor({
  extensions: [
    StarterKit,
    Image,
    Underline,
    Strike,
    Superscript,
    Subscript,
    Link,
    SoftBreak,
    FontFamily,
    TextStyle,
    // CustomEnterBehavior,
    ImageSelector,
    NodeRange.configure({
      // allow to select only on depth 0
      // depth: 0,
      key: null,
    }),
    DragHandle.configure({
      render() {
        const element = document.createElement("div");

        element.classList.add("custom-drag-handle");

        return element;
      },
    }),
    Placeholder.configure({
      placeholder: "Type something or press / for commands.",
    }),
  ],
  content: model.value,
  editorProps: {
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
    },
  },
  onUpdate: (e) => {
    // Update the model with the new content
    props.contentMode === "json"
      ? (model.value = e.editor.getJSON())
      : (model.value = e.editor.getHTML());
  },
  onSelectionUpdate: (e) => {
    const { $to, $from } = e.editor.state.selection;
    const fromCompare = {
      pos: $from.pos,
      depth: $from.depth,
      parentOffset: $from.parentOffset,
    };

    const toCompare = {
      pos: $to.pos,
      depth: $to.depth,
      parentOffset: $to.parentOffset,
    };

    const selectionExists =
      JSON.stringify(fromCompare) !== JSON.stringify(toCompare);
    // console.log(selectionExists, fromCompare, toCompare)
    textIsSelected.value = selectionExists;
  },
  onPaste: (e) => {
    console.log(e);
  },
});
</script>

<style lang="scss" scoped>
.editor-container {
  position: relative;

  @apply text-gray-700;

  :deep(div[data-tippy-root]) {
    @apply z-30 !important;
  }

  :deep(*) {
    div[data-tippy-root] {
      @apply z-30 !important;
    }

    .editor-content {
      position: relative;
      //   border: 1px solid #ccc;
      //   border-radius: 4px;
      //   padding: 1rem;
    }

    /* Basic editor styles */
    // .tiptap {
    :first-child {
      margin-top: 0;
    }

    a {
      @apply text-blue-500 underline cursor-pointer;
    }

    /* List styles */
    ul,
    ol {
      @apply pl-4 pr-4 my-5 mx-4;

      li {
        @apply mb-2;

        &::marker {
          @apply text-gray-500;
        }

        p {
          @apply my-1;
        }
      }
    }

    ul {
      @apply list-disc;
    }

    ol {
      @apply list-decimal;
    }

    /* Heading styles */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @apply leading-tight mt-10 text-pretty font-bold;
    }

    h1,
    h2 {
      @apply mt-14 mb-6;
    }

    h1 {
      @apply text-2xl;
    }

    h2 {
      @apply text-xl;
    }

    h3 {
      @apply text-lg;
    }

    h4,
    h5,
    h6 {
      @apply text-base;
    }

    /* Code and preformatted text styles */
    code {
      @apply bg-purple-100 rounded-md text-black text-sm py-1 px-1.5;
    }

    pre {
      @apply rounded-lg text-white font-mono my-6 p-3;

      code {
        @apply bg-transparent text-inherit text-xs p-0;
      }
    }

    blockquote {
      @apply border-l-4 border-gray-300 my-6 pl-4;
    }

    hr {
      @apply border-solid border-t-2 border-gray-200 my-8;
    }
    // }

    /* Floating menu */
    .floating-menu {
      @apply flex bg-gray-300 p-0.5 rounded-lg;

      button {
        @apply bg-transparent py-1 px-1.5 rounded-md;

        &:hover {
          @apply bg-gray-300;
        }

        &.is-active {
          @apply bg-white text-purple-600;

          &:hover {
            @apply text-purple-800;
          }
        }
      }
    }

    ::selection {
      @apply bg-blue-200 bg-opacity-50;
    }

    .ProseMirror {
      @apply py-4 pr-4 pl-0;

      * {
        @apply mt-3;
      }

      > * {
        @apply ml-12;
      }

      .ProseMirror-widget * {
        @apply mt-0;
      }

      ul,
      ol {
        @apply px-4;
      }
    }

    .ProseMirror-noderangeselection {
      *::selection {
        @apply bg-transparent;
      }

      * {
        @apply caret-transparent;
      }
    }

    .ProseMirror-selectednode,
    .ProseMirror-selectednoderange {
      @apply relative;

      &::before {
        @apply absolute pointer-events-none -z-10 content-[''] -inset-1 bg-blue-200 bg-opacity-50 rounded;
      }
    }

    .custom-drag-handle {
      &::after {
        @apply flex items-center justify-center w-4 h-5 content-['⠿'] font-bold cursor-grab bg-black bg-opacity-5 text-black text-opacity-30 rounded;
      }
    }

    /* Placeholder (at the top) */
    p.is-editor-empty:first-child::before {
      @apply text-gray-300 content-[attr(data-placeholder)] float-left h-0 pointer-events-none;
    }
  }
}
</style>
