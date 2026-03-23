import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateDeck } from '@/hooks/useDecks'
import { useAuth } from '@/hooks/useAuth'
import { DEFAULT_THEME, FONT_OPTIONS, ACCENT_COLORS } from '@/lib/types/theme'
import type { Theme } from '@/lib/types/theme'
import { cn } from '@/lib/utils'

interface CreateDeckDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDeckDialog({ open, onOpenChange }: CreateDeckDialogProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const createDeck = useCreateDeck()
  const [title, setTitle] = useState('Untitled Deck')
  const [theme, setTheme] = useState<Theme>({ ...DEFAULT_THEME })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    const deck = await createDeck.mutateAsync({
      user_id: user.id,
      title: title || 'Untitled Deck',
      theme,
    })
    onOpenChange(false)
    setTitle('Untitled Deck')
    setTheme({ ...DEFAULT_THEME })
    navigate(`/deck/${deck.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleCreate}>
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deck-title">Title</Label>
            <Input
              id="deck-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Deck"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors cursor-pointer',
                    theme.mode === mode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  )}
                  onClick={() => setTheme({ ...theme, mode })}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-7 h-7 rounded-full transition-transform cursor-pointer',
                    theme.accentColor === color && 'ring-2 ring-offset-2 ring-offset-popover ring-primary scale-110'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setTheme({ ...theme, accentColor: color })}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Font</Label>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font}
                  type="button"
                  className={cn(
                    'rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer',
                    theme.fontFamily === font
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  )}
                  style={{ fontFamily: font === 'system' ? 'system-ui' : font === 'Degular' ? 'degular' : `'${font}'` }}
                  onClick={() => setTheme({ ...theme, fontFamily: font })}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={createDeck.isPending}>
            {createDeck.isPending ? 'Creating...' : 'Create Deck'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
