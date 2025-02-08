import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { Editor, Node as ProseMirrorNode } from '@tiptap/core'
import type { Decoration, DecorationSource, EditorView } from 'prosemirror-view'
import type { Slice } from 'prosemirror-model'

import Drag from './components/Drag.vue'

// function splitDraggableItem(editor: Editor) {
//   console.log('splitDraggableItem', editor.getJSON())
//   return editor.chain().run()
//   return editor.chain().splitBlock().lift('draggableItem').wrapIn('draggableItem').run()
// }

export default Node.create({
  name: 'draggableItem',

  group: 'block',

  content: 'block+',

  draggable: true,

  validParents: ['doc'],

  parseHTML() {
    return [
      {
        tag: 'draggable-item',
      },
      {
        tag: 'div',
        attrs: {
          'data-type': 'draggable-item',
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // return ['draggable-item', mergeAttributes(HTMLAttributes), 0]
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'draggable-item' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(Drag as any)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('draggableItemDropHandler'),
        props: {
          handleDrop: (view: EditorView, event: DragEvent, slice: Slice, moved: boolean) => {
            console.log('drop', view, event, slice, moved)
            // Implement your drop logic here
            return false // Return true if you've handled the drop, false to let other plugins handle it
          },
        },
      }),
    ]
  },

  onUpdate() {
    const { editor, type } = this
    console.log('update', editor.getJSON())
    editor.commands.lift(type.name)
    // editor.commands.wrapIn(type.name)

    // editor.

    // Make sure all the top level nodes are draggable items
    const topLevelNodes = editor.getJSON().content || []
    let changes = false

    topLevelNodes.forEach((node, i) => {
      // console.log('node', node, i)
      if (node.type !== 'draggableItem') {
        console.error('Found a node that is not a draggable item', node)

        // node = {
        //   type: 'draggableItem',
        //   content: [node],
        // }

        // topLevelNodes[i] = node
        // changes = true
      }
    })
  },

  // addKeyboardShortcuts() {
  //   return {
  //     Enter: ({ editor }: { editor: Editor }) => {
  //       if (!editor.isActive('draggableItem')) return false
  //       return splitDraggableItem(editor)
  //     },
  //   }
  // },
})
