import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { NodeSelection } from 'prosemirror-state'

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    const key = new PluginKey('dragHandle')

    return [
      new Plugin({
        key,
        props: {
          handleDOMEvents: {
            mousedown: (view: EditorView, event: MouseEvent) => {
              const target = event.target as HTMLElement
              if (!target.classList.contains('drag-handle')) {
                return false
              }

              event.preventDefault()
              const pos = view.posAtDOM(target, 0)
              const $pos = view.state.doc.resolve(pos)
              const node = $pos.node()

              if (!node.type.spec.draggable) {
                return false
              }

              view.dispatch(
                view.state.tr.setSelection(NodeSelection.create(view.state.doc, $pos.before())),
              )

              const dragStart = view.coordsAtPos(pos)
              const mouseStart = { x: event.clientX, y: event.clientY }

              const move = (moveEvent: MouseEvent) => {
                const { clientX, clientY } = moveEvent
                const dx = clientX - mouseStart.x
                const dy = clientY - mouseStart.y

                target.style.transform = `translate(${dx}px, ${dy}px)`
              }

              const up = (upEvent: MouseEvent) => {
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)

                const endPos = view.posAtCoords({ left: upEvent.clientX, top: upEvent.clientY })
                if (endPos) {
                  const tr = view.state.tr
                  tr.delete($pos.before(), $pos.after())
                  tr.insert(endPos.pos, node)
                  view.dispatch(tr)
                }

                target.style.transform = ''
              }

              document.addEventListener('mousemove', move)
              document.addEventListener('mouseup', up)

              return true
            },
          },
        },
      }),
    ]
  },
})
