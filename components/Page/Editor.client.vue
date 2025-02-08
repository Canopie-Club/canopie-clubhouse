<template>
  <div>
    <div ref="editorEl" />
  </div>
</template>

<script setup lang="ts">
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import EditorImage from "@editorjs/image";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import CheckList from "@editorjs/checklist";
// @ts-ignore
import Link from "@editorjs/link";
import Style from "editorjs-style";
// @ts-ignore
import Underline from "@editorjs/underline";

import { SimpleImage } from "@/assets/editorjs/simpleImage";

const editorEl = ref<HTMLDivElement | null>(null);
const editor = computed(() => {
  if (!editorEl.value) return null;
  return new EditorJS({
    holder: editorEl.value,
    tools: {
      header: Header,
      paragraph: Paragraph,
      list: List,
      quote: Quote,
      embed: Embed,
      // @ts-ignore
      image: EditorImage,
      simpleImage: SimpleImage,
      table: Table,
      inlineCode: InlineCode,
      marker: Marker,
      checklist: CheckList,
      link: Link,
      // @ts-ignore
      // style: Style,
      underline: Underline,
    },
    inlineToolbar: true,
    onReady: () => {
      console.log("editor ready");
    },
  });
});


watch(editor, (newVal) => {
  console.log("editor", newVal);
});

</script>

<style scoped></style>
