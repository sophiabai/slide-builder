import { useState, useEffect } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { Page } from '@/lib/types/database'

interface EditableTitleProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function EditableTitle({ page, mode, deckId }: EditableTitleProps) {
  const [value, setValue] = useState(page.title)
  const { debouncedSave } = useAutoSave(page.id, deckId ?? page.deck_id)

  useEffect(() => {
    setValue(page.title)
  }, [page.title])

  if (mode === 'present') {
    if (!page.title) return null
    return (
      <h1 className="text-6xl font-bold leading-tight" style={{ color: 'var(--slide-text)' }}>
        {page.title}
      </h1>
    )
  }

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedSave({ title: e.target.value })
      }}
      placeholder="Slide title"
      className="w-full bg-transparent text-6xl font-bold leading-tight outline-none placeholder:opacity-20"
      style={{ color: 'var(--slide-text)' }}
    />
  )
}
