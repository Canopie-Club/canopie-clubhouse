<template>
  <node-view-wrapper class="draggable-item">
    <div
      @dragend="onDragEnd"
      class="drag-handle"
      contenteditable="false"
      draggable="true"
      data-drag-handle
    />
    <node-view-content class="content" />
    <p v-if="empty" class="placeholder">Press enter to add a new line</p>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Editor, type JSONContent } from '@tiptap/core'
import { Transaction } from '@tiptap/pm/state'
import clone from 'just-clone'
import compare from 'just-compare'
const props = defineProps(nodeViewProps)

const count = ref(0)
let json: JSONContent[] = clone(props.node.content.toJSON())

const empty = ref(true)

const incrementCount = () => {
  count.value++
}

const updateEmpty = () => {
  if (json.length >= 2) {
    empty.value = false
    return
  }

  if (json.length === 0) {
    empty.value = true
    return
  }

  empty.value = json.every(item => !item.content || item.content.length === 0)
}

const onUpdate = () => {
  if (!compare(json, props.node.content.toJSON())) {
    // console.log('update', props.node.content.toJSON())
    json = clone(props.node.content.toJSON())
    updateEmpty()
  }
}

onMounted(() => {
  // console.log('Component mounted')
  props.editor.on('transaction', onUpdate)
  json = clone(props.node.content.toJSON())
  updateEmpty()
})

onBeforeUnmount(() => {
  // console.log('Component unmounted')
  props.editor.off('transaction', onUpdate)
})

const onDragEnd = (e: DragEvent) => {
  const { node, getPos, editor } = props
  console.log('props', props)
  editor.commands.lift(node.type.name)
  if (typeof getPos === 'function') {
    const pos = getPos()
    console.log('pos', pos)
    // const resolvedPos = props.editor.state.doc.resolve(pos)
    // const parent = resolvedPos.parent
    console.log('Node:', node)
    // console.log('Parent:', parent)
    // console.log('Parent type:', parent.type.name)
    // console.log('Parent content:', parent.content.toJSON())
  }
}
</script>

<style lang="scss">
.draggable-item {
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  background: white;
  //   box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.05);
  // border: 1px solid #e2e8f0;

  .drag-handle {
    flex: 0 0 auto;
    position: relative;
    width: 1rem;
    height: 1rem;
    top: 0.3rem;
    margin-right: 0.5rem;
    cursor: grab;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><path fill-opacity="0.2" d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    & > .drag-handle {
      opacity: 1;
    }
  }

  .content {
    flex: 1 1 auto;
  }

  .placeholder {
    color: #999;
    position: absolute;
    // top: 0;
    left: 2rem;
    // width: 100%;
    // height: 100%;
    // display: flex;
    // // align-items: center;
    // // justify-content: center;
  }
}
</style>
