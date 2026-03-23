import { useDecks } from '@/hooks/useDecks'
import { DeckCard } from './DeckCard'

export function DeckGrid() {
  const { data: decks, isLoading, error } = useDecks()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Failed to load decks. Please try again.
      </div>
    )
  }

  if (!decks || decks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No decks yet. Create your first deck to get started.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  )
}
