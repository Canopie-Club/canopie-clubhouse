<template>
  <div class="editor-window">
    <Editor ref="editor" v-model="content" :content-mode="contentMode" />
    <ToolDebug :items="[contentDisplay]" />
    <!-- <Editor v-model="content" :content-mode="contentMode" /> -->
    <div class="flex flex-col gap-2">
      <div>Mode: {{ contentMode }}</div>
      <Button @click="changeMode">Change Mode</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type JSONContent } from '@tiptap/vue-3'
import pretty from 'pretty'
import Editor from './Editor.vue'
import { Button } from '~/components/ui/button'

const editor = ref<InstanceType<typeof Editor> | null>(null)

// import Editor from './Editor.vue'

const content = ref<JSONContent | string>(`<h1>This is My Island In the Sun</h1>
<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
<p>Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam quis risus eget urna mollis ornare vel eu leo.</p>
<img data-type="image-select" tt-src="/_f/thedukeofnorfolk/PICT0952.JPG" />
<ul>
  <li>
    <p><strong>Yeah</strong></p>
  </li>
  <li>
    <p><em>Yeah</em></p>
  </li>
  <li>
    <p><u>Yeah</u></p>
  </li>
  <li>
    <p><strong><em><u>Yeah!</u></em></strong></p>
  </li>
</ul>`)
const contentMode = ref<'json' | 'html'>('html')

const contentDisplay = computed(() => {
  return typeof content.value !== 'string' ? content.value : pretty(content.value)
})

const changeMode = () => {
  contentMode.value = contentMode.value === 'json' ? 'html' : 'json'

  nextTick(() => {
    const newContent = getContent()
    if (newContent) content.value = newContent
  })
}

const getContent = () => {
  return editor.value?.getContent()
}
</script>

<style scoped>
.editor-window {
  width: 100%;
  height: 100%;
  padding: 1rem;
  /* background-color: #f5f5f5; */
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}
</style>
