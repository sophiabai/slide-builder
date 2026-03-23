import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Page } from '@/lib/types/database'
import type { Theme } from '@/lib/types/theme'

interface PageThumbnailProps {
  page: Page
  index: number
  isActive: boolean
  theme: Theme
  onClick: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function PageThumbnail({
  page,
  index,
  isActive,
  theme,
  onClick,
  onDelete,
  onDuplicate,
}: PageThumbnailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: page.id })
  const [menuOpen, setMenuOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative rounded-md cursor-pointer transition-all',
        isDragging && 'opacity-50',
        isActive ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-border'
      )}
      onClick={onClick}
    >
      <div
        className="aspect-video rounded-md overflow-hidden p-2 flex flex-col justify-center"
        style={{
          backgroundColor: theme.mode === 'dark' ? '#0F0F0F' : '#FFFFFF',
          color: theme.mode === 'dark' ? '#F5F5F5' : '#1A1A1A',
        }}
      >
        {page.eyebrow && (
          <p
            className="text-[4px] uppercase tracking-wider truncate"
            style={{ color: theme.accentColor }}
          >
            {page.eyebrow}
          </p>
        )}
        <p className="text-[6px] font-semibold truncate">
          {page.title || 'Untitled'}
        </p>
        {page.layout !== 'block' && page.body_text && (
          <p className="text-[3px] opacity-60 truncate mt-0.5">
            {page.body_text.replace(/<[^>]*>/g, '').slice(0, 60)}
          </p>
        )}
      </div>

      <span className="absolute top-1 left-1 text-[8px] text-muted-foreground bg-background/80 rounded px-1">
        {index + 1}
      </span>

      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-0.5 rounded bg-background/80 hover:bg-muted cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <MoreHorizontal className="h-3 w-3" />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-32 rounded-md border border-border bg-popover shadow-lg z-10 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted transition-colors cursor-pointer"
              onClick={() => { onDuplicate(); setMenuOpen(false) }}
            >
              <Copy className="h-3 w-3" /> Duplicate
            </button>
            <button
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted transition-colors text-destructive cursor-pointer"
              onClick={() => { onDelete(); setMenuOpen(false) }}
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
