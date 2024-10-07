import { Extension } from '@tiptap/core'

export const SoftBreak = Extension.create({
  name: 'softBreak',
  addKeyboardShortcuts() {
    return {
      'Shift-Enter': () => this.editor.commands.setHardBreak(),
    }
  },
})
