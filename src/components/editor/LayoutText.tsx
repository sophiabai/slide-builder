import { EditableEyebrow } from './EditableEyebrow'
import { EditableTitle } from './EditableTitle'
import { EditableBody } from './EditableBody'
import type { Page } from '@/lib/types/database'

interface LayoutTextProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function LayoutText({ page, mode, deckId }: LayoutTextProps) {
  return (
    <div className="w-full h-full flex items-center justify-center px-[15%] py-20">
      <div className="w-full max-w-[70%] space-y-6">
        <EditableEyebrow page={page} mode={mode} deckId={deckId} />
        <EditableTitle page={page} mode={mode} deckId={deckId} />
        <EditableBody page={page} mode={mode} deckId={deckId} />
      </div>
    </div>
  )
}
