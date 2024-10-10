<template>
  <div class="editor-menu-bar">
    <div class="button-group">
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor?.isActive('bold') }"
      >
        <strong>B</strong>
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor?.isActive('italic') }"
      >
        <em>I</em>
      </button>
      <button
        @click="editor?.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor?.isActive('underline') }"
      >
        <span class="underline">U</span>
      </button>
      <button @click="toggleLink" :class="{ 'is-active': editor?.isActive('link') }">
        <Icon name="heroicons:link" class="h-4 w-4" />
      </button>
    </div>
    <div class="button-group dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <!-- <button>{{ textIsSelected ? 'Convert' : 'Insert' }}</button> -->
          <Button class="button">
            Insert
            <Icon name="heroicons:chevron-down" class="ml-2 h-4 w-4" />
          </Button>
          <!-- <Button>{{ textIsSelected ? 'Convert' : 'Insert' }}</Button> -->
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @select="editor?.chain().focus().setHorizontalRule().run()">
            Horizontal Rule
          </DropdownMenuItem>
          <DropdownMenuItem @select="addImage"> Image </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="button-group dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <!-- <button>{{ textIsSelected ? 'Convert' : 'Insert' }}</button> -->
          <Button class="button">
            Type
            <Icon name="heroicons:chevron-down" class="ml-2 h-4 w-4" />
          </Button>
          <!-- <Button>{{ textIsSelected ? 'Convert' : 'Insert' }}</Button> -->
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @select="insertOrConvertParagraph()"> Paragraph </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Heading</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                v-for="level in 6"
                :key="level"
                :class="{ 'is-active': editor?.isActive('heading', { level }) }"
                @select="
                  editor
                    ?.chain()
                    .focus()
                    .toggleHeading({ level: level as Level })
                    .run()
                "
              >
                H{{ level }}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            :class="{ 'is-active': editor?.isActive('bulletList') }"
            @select="editor?.chain().focus().toggleBulletList().run()"
          >
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="{ 'is-active': editor?.isActive('orderedList') }"
            @select="editor?.chain().focus().toggleOrderedList().run()"
          >
            Numbered List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    <div class="button-group dropdown">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="button">
            Font
            <Icon name="heroicons:chevron-down" class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Arial').run()">
            Arial
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Helvetica').run()">
            Helvetica
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Times New Roman').run()">
            Times New Roman
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Courier').run()">
            Courier
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Verdana').run()">
            Verdana
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Georgia').run()">
            Georgia
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Palatino').run()">
            Palatino
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().setFontFamily('Garamond').run()">
            Garamond
          </DropdownMenuItem>
          <DropdownMenuItem @select="editor?.chain().focus().unsetFontFamily().run()">
            Default
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </div>

    <EditorLinkDialog ref="linkDialog" />
  </div>
</template>

<script setup lang="ts">
import { type Editor } from "@tiptap/vue-3";
import { type Level } from "@tiptap/extension-heading";
import EditorLinkDialog from "./EditorLinkDialog.vue";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "~/components/ui/dropdown-menu";

const props = defineProps<{
  editor?: Editor;
  textIsSelected?: boolean;
}>();

const linkDialog = ref<InstanceType<typeof EditorLinkDialog> | null>(null);

const addImage = () => {
  // props.editor?.chain().focus().insertContent({ type: 'imageSelector' }).run()
  props.editor?.chain().focus().insertImageSelector().run();
  // alert('inserted')
  // const url = window.prompt('Enter the URL of the image:')
  // if (url) {
  //   // props.editor?.chain().focus().setImage({ src: url }).run()
  // }
};

const toggleLink = async () => {
  if (props.editor?.isActive("link")) {
    props.editor?.chain().focus().unsetLink().run();
  } else {
    const url = await linkDialog.value?.getLinkUrl();
    if (url && url !== "") {
      props.editor?.chain().focus().setLink({ href: url }).run();
    }
  }
};

const insertOrConvertParagraph = () => {
  if (props.textIsSelected) {
    props.editor?.chain().focus().setParagraph().run();
  } else {
    props.editor?.chain().splitBlock().setParagraph().run();
  }
};

const insertOrConvertHeading = () => {
  props.editor?.chain().focus().toggleHeading({ level: 2 }).run();
};

const insertOrConvertBulletList = () => {
  props.editor?.chain().focus().toggleBulletList().run();
};

const insertOrConvertOrderedList = () => {
  props.editor?.chain().focus().toggleOrderedList().run();
};
</script>

<style lang="scss" scoped>
.editor-menu-bar {
  @apply mb-4 flex flex-wrap gap-0 bg-slate-100 border-slate-200 rounded text-sm;
}

.button-group {
  @apply flex gap-0;
}

button {
  @apply text-slate-800 bg-slate-100 rounded-none shadow-none mx-0;
  @apply text-sm py-1 px-2 cursor-pointer transition-colors duration-200;

  &:hover,
  &.is-active {
    @apply bg-slate-200;
  }

  &:first-child {
    @apply rounded-l pl-3;
  }
}
</style>
