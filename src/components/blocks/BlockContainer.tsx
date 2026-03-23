import { useState } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import { BlockTypePicker } from './BlockTypePicker'
import { ImageBlock } from './ImageBlock'
import { VideoBlock } from './VideoBlock'
import { IframeBlock } from './IframeBlock'
import { CodeBlock } from './CodeBlock'
import { LottieBlock } from './LottieBlock'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Replace, X } from 'lucide-react'
import type { Page } from '@/lib/types/database'
import type { Block } from '@/lib/types/block'

interface BlockContainerProps {
  page: Page
  mode: 'edit' | 'present'
  deckId?: string
}

export function BlockContainer({ page, mode, deckId }: BlockContainerProps) {
  const { immediateSave } = useAutoSave(page.id, deckId ?? page.deck_id)
  const [showPicker, setShowPicker] = useState(false)
  const [editing, setEditing] = useState(false)
  const [hover, setHover] = useState(false)

  function handleBlockChange(block: Block) {
    immediateSave({ block })
    setEditing(false)
    setShowPicker(false)
  }

  function handleRemove() {
    immediateSave({ block: null })
    setEditing(false)
  }

  if (!page.block) {
    if (mode === 'present') return null

    return (
      <div className="w-full h-full relative">
        {showPicker ? (
          <BlockTypePicker
            page={page}
            deckId={deckId ?? page.deck_id}
            onSelect={handleBlockChange}
            onCancel={() => setShowPicker(false)}
          />
        ) : (
          <button
            className="w-full h-full min-h-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer hover:border-[var(--slide-accent)] hover:bg-[var(--slide-surface)]"
            style={{ borderColor: 'var(--slide-border)' }}
            onClick={() => setShowPicker(true)}
          >
            <Plus className="h-10 w-10 opacity-30" />
            <span className="text-lg opacity-40">Add a block</span>
          </button>
        )}
      </div>
    )
  }

  if (editing && mode === 'edit') {
    return (
      <div className="w-full h-full">
        <BlockTypePicker
          page={page}
          deckId={deckId ?? page.deck_id}
          onSelect={handleBlockChange}
          onCancel={() => setEditing(false)}
          initialBlock={page.block}
        />
      </div>
    )
  }

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <BlockRenderer block={page.block} mode={mode} deckId={deckId} />

      {mode === 'edit' && hover && (
        <div className="absolute top-3 right-3 flex gap-1 z-10">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowPicker(true)}>
            <Replace className="h-3 w-3" /> Replace
          </Button>
          <Button size="sm" variant="secondary" onClick={handleRemove}>
            <X className="h-3 w-3" /> Remove
          </Button>
        </div>
      )}

      {showPicker && mode === 'edit' && (
        <div className="absolute inset-0 z-20">
          <BlockTypePicker
            page={page}
            deckId={deckId ?? page.deck_id}
            onSelect={handleBlockChange}
            onCancel={() => setShowPicker(false)}
          />
        </div>
      )}
    </div>
  )
}

function BlockRenderer({ block, mode, deckId }: { block: Block; mode: 'edit' | 'present'; deckId?: string }) {
  switch (block.type) {
    case 'image':
      return <ImageBlock block={block} />
    case 'video':
      return <VideoBlock block={block} />
    case 'iframe':
      return <IframeBlock block={block} mode={mode} />
    case 'code':
      return <CodeBlock block={block} />
    case 'lottie':
      return <LottieBlock block={block} deckId={deckId} />
    default:
      return null
  }
}
