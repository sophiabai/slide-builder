import { useNavigate } from 'react-router-dom'
import { useDeleteDeck, useDuplicateDeck } from '@/hooks/useDecks'
import type { Deck } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Copy, Trash2, Presentation } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DeckCardProps {
  deck: Deck
}

export function DeckCard({ deck }: DeckCardProps) {
  const navigate = useNavigate()
  const deleteDeck = useDeleteDeck()
  const duplicateDeck = useDuplicateDeck()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const pageCount = deck.pages?.[0]?.count ?? 0
  const updatedAt = new Date(deck.updated_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteDeck.mutate(deck.id)
    setMenuOpen(false)
    setConfirmDelete(false)
  }

  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/deck/${deck.id}`)}
    >
      <div className="aspect-video rounded-md mb-3 overflow-hidden relative"
        style={{ backgroundColor: deck.theme.mode === 'dark' ? '#0F0F0F' : '#F5F5F5' }}
      >
        <div className="absolute bottom-2 right-2 flex gap-1">
          <div
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ backgroundColor: deck.theme.accentColor }}
          />
        </div>
      </div>

      <h3 className="font-medium truncate mb-1">{deck.title}</h3>
      <p className="text-xs text-muted-foreground">
        {pageCount} {pageCount === 1 ? 'page' : 'pages'} &middot; {updatedAt}
      </p>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
              setConfirmDelete(false)
            }}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-40 rounded-md border border-border bg-popover shadow-lg z-10 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  navigate(`/present/${deck.id}`)
                  setMenuOpen(false)
                }}
              >
                <Presentation className="h-3.5 w-3.5" /> Present
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  duplicateDeck.mutate(deck.id)
                  setMenuOpen(false)
                }}
              >
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </button>
              <button
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer',
                  confirmDelete && 'text-destructive'
                )}
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {confirmDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
