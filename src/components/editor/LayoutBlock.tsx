import { EditableEyebrow } from './EditableEyebrow'
import { EditableTitle } from './EditableTitle'
import { BlockContainer } from '@/components/blocks/BlockContainer'
import type { Page } from '@/lib/types/database'

interface LayoutBlockProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function LayoutBlock({ page, mode, deckId }: LayoutBlockProps) {
  return (
    <div className="w-full h-full flex flex-col p-16">
      <div className="space-y-3 mb-8">
        <EditableEyebrow page={page} mode={mode} deckId={deckId} />
        <EditableTitle page={page} mode={mode} deckId={deckId} />
      </div>
      <div className="flex-1 min-h-0">
        <BlockContainer page={page} mode={mode} deckId={deckId} />
      </div>
    </div>
  )
}
