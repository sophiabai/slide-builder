import { useState, useEffect } from 'react'
import { PageRenderer } from '@/components/editor/PageRenderer'
import type { Page } from '@/lib/types/database'
import type { Theme } from '@/lib/types/theme'

interface SlideViewProps {
  page: Page
  theme: Theme
}

export function SlideView({ page, theme }: SlideViewProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scaleX = vw / 1920
      const scaleY = vh / 1080
      setScale(Math.min(scaleX, scaleY))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <PageRenderer page={page} theme={theme} mode="present" />
    </div>
  )
}
