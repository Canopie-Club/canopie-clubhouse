import { Extension, Editor } from '@tiptap/core'
import type { ResolvedPos } from '@tiptap/pm/model'

function splitDraggableItem(editor: Editor) {
  // return editor.chain().splitBlock().run()
  // return editor.chain().lift('draggableItem').run()
  return editor.chain().splitBlock().lift('draggableItem').wrapIn('draggableItem').run()
}

function splitListItem(editor: Editor) {
  const { $from, $to } = editor.state.selection
  const isEmptySplit = $from.parentOffset === 0 && $to.parentOffset === $to.parent.content.size

  if (isEmptySplit) {
    return editor.chain().lift('listItem').run()
  }
  editor.chain().splitBlock().run()
  editor.chain().lift('listItem').run()
  return editor.chain().wrapIn('listItem').run()
}

function isAtStartOfNode(pos: ResolvedPos) {
  console.log(pos.parentOffset, pos.pos, pos.parent.content.size)
  return pos.parentOffset === 0 && pos.pos <= 2
}

function isAtEndOfNode(pos: ResolvedPos) {
  return pos.parentOffset === pos.parent.content.size
}

function isFirstNode(pos: ResolvedPos) {
  return pos.depth <= 2 && pos.index(0) === 0
}

function keepDraggable(editor: Editor) {
  const topLevelNodes = editor.getJSON().content || []
  console.log(topLevelNodes)
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
  // return editor.chain().splitBlock().lift('draggableItem').wrapIn('draggableItem').run()
}

export const CustomEnterBehavior = Extension.create({
  name: 'customEnterBehavior',

  addKeyboardShortcuts() {
    return {
      // Enter: ({ editor }: { editor: Editor }) => {
      //   // if (editor.isActive('listItem')) return false
      //   if (editor.isActive('listItem')) return splitListItem(editor)
      //   if (!editor.isActive('draggableItem')) return false
      //   return splitDraggableItem(editor)
      //   return false
      // },
      Backspace: ({ editor }: { editor: Editor }) => {
        // const { $from, $to } = editor.state.selection
        // const fromStart = isAtStartOfNode($from)
        // const toStart = isAtStartOfNode($to)
        // const fromFirstNode = isFirstNode($from)
        // const toFirstNode = isFirstNode($to)
        // const toEnd = isAtEndOfNode($to)

        keepDraggable(editor)

        // console.log('Backspace', fromFirstNode, toFirstNode, toEnd)
        // console.log(editor.state.selection)
        // console.log($from)
        // console.log($to)
        // console.log($from.index(0))

        // if (toEnd) console.error('toEnd')

        // if (fromStart && toStart && fromFirstNode && toFirstNode) {
        //   // We're at the beginning of the first node, handle accordingly
        //   // For now, we'll just return true to prevent default behavior
        //   console.log('Backspace at start')
        //   return true
        // }
        return false
      },
    }
  },
})
