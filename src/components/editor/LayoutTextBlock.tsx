import { EditableEyebrow } from './EditableEyebrow'
import { EditableTitle } from './EditableTitle'
import { EditableBody } from './EditableBody'
import { BlockContainer } from '@/components/blocks/BlockContainer'
import type { Page } from '@/lib/types/database'

interface LayoutTextBlockProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function LayoutTextBlock({ page, mode, deckId }: LayoutTextBlockProps) {
  return (
    <div className="w-full h-full flex items-stretch p-16" style={{ gap: 48 }}>
      <div className="flex flex-col justify-center" style={{ width: '45%' }}>
        <div className="space-y-6">
          <EditableEyebrow page={page} mode={mode} deckId={deckId} />
          <EditableTitle page={page} mode={mode} deckId={deckId} />
          <EditableBody page={page} mode={mode} deckId={deckId} />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ width: '55%' }}>
        <BlockContainer page={page} mode={mode} deckId={deckId} />
      </div>
    </div>
  )
}
