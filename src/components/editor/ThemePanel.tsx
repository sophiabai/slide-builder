import { useUpdateDeck } from '@/hooks/useDecks'
import { useEditorStore } from '@/stores/editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Sun, Moon } from 'lucide-react'
import { ACCENT_COLORS, FONT_OPTIONS } from '@/lib/types/theme'
import type { Theme } from '@/lib/types/theme'
import type { Deck } from '@/lib/types/database'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface ThemePanelProps {
  deck: Deck
}

export function ThemePanel({ deck }: ThemePanelProps) {
  const { setThemePanelOpen } = useEditorStore()
  const updateDeck = useUpdateDeck()
  const [theme, setTheme] = useState<Theme>(deck.theme)
  const [customColor, setCustomColor] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setTheme(deck.theme)
  }, [deck.theme])

  function applyTheme(newTheme: Theme) {
    setTheme(newTheme)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateDeck.mutate({ id: deck.id, updates: { theme: newTheme } })
    }, 500)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 border-l border-border bg-card shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="font-semibold">Theme</h2>
        <Button variant="ghost" size="icon" onClick={() => setThemePanelOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="flex gap-2">
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer',
                theme.mode === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted'
              )}
              onClick={() => applyTheme({ ...theme, mode: 'dark' })}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              className={cn(
                'flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer',
                theme.mode === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted'
              )}
              onClick={() => applyTheme({ ...theme, mode: 'light' })}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                className={cn(
                  'w-8 h-8 rounded-full transition-transform cursor-pointer',
                  theme.accentColor === color && 'ring-2 ring-offset-2 ring-offset-card ring-primary scale-110'
                )}
                style={{ backgroundColor: color }}
                onClick={() => applyTheme({ ...theme, accentColor: color })}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="#hex"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (/^#[0-9A-Fa-f]{6}$/.test(customColor)) {
                  applyTheme({ ...theme, accentColor: customColor })
                }
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <div className="space-y-1">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font}
                className={cn(
                  'w-full rounded-md border px-3 py-2 text-sm text-left transition-colors cursor-pointer',
                  theme.fontFamily === font
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:bg-muted'
                )}
                style={{ fontFamily: font === 'system' ? 'system-ui' : `'${font}'` }}
                onClick={() => applyTheme({ ...theme, fontFamily: font })}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
