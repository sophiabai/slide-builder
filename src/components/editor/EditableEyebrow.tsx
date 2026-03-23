import { useState, useEffect } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import type { Page } from '@/lib/types/database'

interface EditableEyebrowProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function EditableEyebrow({ page, mode, deckId }: EditableEyebrowProps) {
  const [value, setValue] = useState(page.eyebrow)
  const { debouncedSave } = useAutoSave(page.id, deckId ?? page.deck_id)

  useEffect(() => {
    setValue(page.eyebrow)
  }, [page.eyebrow])

  if (mode === 'present') {
    if (!page.eyebrow) return null
    return (
      <p
        className="text-sm uppercase tracking-[0.2em] font-medium"
        style={{ color: 'var(--slide-accent)' }}
      >
        {page.eyebrow}
      </p>
    )
  }

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedSave({ eyebrow: e.target.value })
      }}
      placeholder="SECTION LABEL"
      className="w-full bg-transparent text-sm uppercase tracking-[0.2em] font-medium outline-none placeholder:opacity-30"
      style={{ color: 'var(--slide-accent)' }}
    />
  )
}
