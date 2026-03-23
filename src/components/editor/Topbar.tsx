import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateDeck } from '@/hooks/useDecks'
import { useEditorStore } from '@/stores/editor-store'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Palette, Play, Check, Loader2 } from 'lucide-react'
import type { Deck } from '@/lib/types/database'

interface TopbarProps {
  deck: Deck
}

export function Topbar({ deck }: TopbarProps) {
  const navigate = useNavigate()
  const updateDeck = useUpdateDeck()
  const { isSaving, lastSavedAt, toggleThemePanel } = useEditorStore()
  const [title, setTitle] = useState(deck.title)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitle(deck.title)
  }, [deck.title])

  function handleTitleBlur() {
    setIsEditing(false)
    if (title.trim() && title !== deck.title) {
      updateDeck.mutate({ id: deck.id, updates: { title: title.trim() } })
    } else {
      setTitle(deck.title)
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setTitle(deck.title)
      setIsEditing(false)
    }
  }

  const saveStatusText = isSaving
    ? 'Saving...'
    : lastSavedAt
      ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : ''

  return (
    <header className="h-13 border-b border-border flex items-center px-4 gap-3 shrink-0">
      <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="text-base font-semibold bg-transparent border-b border-primary outline-none px-1 py-0.5 min-w-0"
            autoFocus
          />
        ) : (
          <button
            className="text-base font-semibold truncate hover:text-primary transition-colors cursor-pointer"
            onClick={() => {
              setIsEditing(true)
              setTimeout(() => inputRef.current?.select(), 0)
            }}
          >
            {title}
          </button>
        )}

        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
          {!isSaving && lastSavedAt && <Check className="h-3 w-3" />}
          {saveStatusText}
        </span>
      </div>

      <Button variant="outline" size="sm" onClick={toggleThemePanel}>
        <Palette className="h-4 w-4" />
        Theme
      </Button>

      <Button size="sm" onClick={() => navigate(`/present/${deck.id}`)}>
        <Play className="h-4 w-4" />
        Present
      </Button>
    </header>
  )
}
