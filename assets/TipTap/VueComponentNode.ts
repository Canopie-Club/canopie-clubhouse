// VueComponentNode.ts

import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Node, mergeAttributes } from '@tiptap/core'
import { defineComponent, h } from 'vue'

const VueComponentNode = Node.create({
  name: 'vueComponentNode',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      // Vue component to be rendered inside the editor
      component: null,
    }
  },

  addAttributes() {
    return {
      // Define any attributes needed for the component
      data: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'vue-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['vue-component', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(this.options.component)
  },
})

export default VueComponentNode
