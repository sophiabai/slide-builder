import { useRef, useState, useEffect } from 'react'
import { PageRenderer } from './PageRenderer'
import type { Page } from '@/lib/types/database'
import type { Theme } from '@/lib/types/theme'

interface CanvasProps {
  page: Page | null
  theme: Theme
  deckId: string
}

export function Canvas({ page, theme, deckId }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scaleX = (width - 64) / 1920
      const scaleY = (height - 64) / 1080
      setScale(Math.min(scaleX, scaleY))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Add a page to get started
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center bg-muted/50 p-8 overflow-hidden">
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
        className="shadow-2xl rounded-lg overflow-hidden"
      >
        <PageRenderer page={page} theme={theme} mode="edit" deckId={deckId} />
      </div>
    </div>
  )
}
