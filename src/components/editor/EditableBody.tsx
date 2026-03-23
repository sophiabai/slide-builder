import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { Page } from '@/lib/types/database'

interface EditableBodyProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function EditableBody({ page, mode, deckId }: EditableBodyProps) {
  const { debouncedSave } = useAutoSave(page.id, deckId ?? page.deck_id)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start typing...' }),
    ],
    content: page.body_text || '',
    editable: mode === 'edit',
    onUpdate: ({ editor: ed }) => {
      debouncedSave({ body_text: ed.getHTML() })
    },
    editorProps: {
      attributes: {
        class: 'outline-none text-xl leading-relaxed min-h-[60px]',
        style: 'color: var(--slide-text-secondary)',
      },
    },
  })

  useEffect(() => {
    if (editor && page.body_text !== editor.getHTML()) {
      editor.commands.setContent(page.body_text || '')
    }
  }, [page.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    editor?.setEditable(mode === 'edit')
  }, [mode, editor])

  if (mode === 'present' && !page.body_text) return null

  return (
    <div className="tiptap-body">
      <EditorContent editor={editor} />
      <style>{`
        .tiptap-body .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          opacity: 0.2;
          color: var(--slide-text-secondary);
        }
        .tiptap-body .tiptap ul { list-style: disc; padding-left: 1.5em; }
        .tiptap-body .tiptap ol { list-style: decimal; padding-left: 1.5em; }
        .tiptap-body .tiptap a { color: var(--slide-accent); text-decoration: underline; }
        .tiptap-body .tiptap strong { font-weight: 700; }
        .tiptap-body .tiptap em { font-style: italic; }
      `}</style>
    </div>
  )
}
