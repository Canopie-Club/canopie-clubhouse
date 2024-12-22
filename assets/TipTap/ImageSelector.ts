import { isNodeSelection, mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'

import ImageSelect from './components/ImageSelect.vue'

export interface ImageSelectorOptions {
  /**
   * The HTML attributes for a horizontal rule node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageSelector: {
      /**
       * Add an image selector
       * @example editor.commands.insertImageSelector()
       */
      insertImageSelector: (options?: { path?: string }) => ReturnType
    }
  }
}

export const ImageSelector = Node.create<ImageSelectorOptions>({
  name: 'imageSelector',

  group: 'block',

  inline: false,

  content: 'block*',

  // atom: true,

  parseHTML() {
    return [
      {
        tag: 'img',
        attrs: {
          'data-type': 'image-select',
        },
      },
      {
        tag: 'image-select',
      },
    ]
  },

  addAttributes() {
    return {
      'tt-src': {
        default: '',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    // console.log(HTMLAttributes)
    // return ['draggable-item', mergeAttributes(HTMLAttributes), 0]
    return ['img', mergeAttributes(HTMLAttributes, { 'data-type': 'image-select' }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageSelect as any)
  },

  addCommands() {
    return {
      insertImageSelector:
        ({ path }: { path?: string } = {}) =>
        ({ chain, state }) => {
          console.log('Running insertImageSelector')
          const { selection } = state
          const { $from: $originFrom, $to: $originTo } = selection

          const currentChain = chain()

          if ($originFrom.parentOffset === 0) {
            currentChain.insertContentAt(
              {
                from: Math.max($originFrom.pos - 1, 0),
                to: $originTo.pos,
              },
              {
                type: this.name,
              },
            )
          } else if (isNodeSelection(selection)) {
            currentChain.insertContentAt($originTo.pos, {
              type: this.name,
              attrs: {
                'tt-src': path || '',
              },
              content: [{ type: 'paragraph' }],
            })
          } else {
            currentChain.insertContent({
              type: this.name,
              attrs: { 'tt-src': path || '' },
              content: [{ type: 'paragraph' }],
            })
          }

          return (
            currentChain
              // set cursor after horizontal rule
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection
                  const posAfter = $to.end()

                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                    }
                  } else {
                    // add node after horizontal rule if it’s the end of the document
                    const node = $to.parent.type.contentMatch.defaultType?.create()

                    if (node) {
                      tr.insert(posAfter, node)
                      tr.setSelection(TextSelection.create(tr.doc, posAfter + 1))
                    }
                  }

                  tr.scrollIntoView()
                }

                return true
              })
              .run()
          )
        },
    }
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
