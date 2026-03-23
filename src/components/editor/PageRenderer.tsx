import { themeToCSS } from '@/lib/utils/theme'
import { LayoutText } from './LayoutText'
import { LayoutTextBlock } from './LayoutTextBlock'
import { LayoutBlock } from './LayoutBlock'
import type { Page } from '@/lib/types/database'
import type { Theme } from '@/lib/types/theme'

interface PageRendererProps {
  page: Page
  theme: Theme
  mode: 'edit' | 'present'
  deckId?: string
}

export function PageRenderer({ page, theme, mode, deckId }: PageRendererProps) {
  const cssVars = themeToCSS(theme)

  return (
    <div
      style={{
        ...cssVars,
        fontFamily: `var(--slide-font)`,
        backgroundColor: 'var(--slide-bg)',
        color: 'var(--slide-text)',
      }}
      className="w-full h-full"
    >
      {page.layout === 'text' && (
        <LayoutText page={page} mode={mode} deckId={deckId} />
      )}
      {page.layout === 'text-block' && (
        <LayoutTextBlock page={page} mode={mode} deckId={deckId} />
      )}
      {page.layout === 'block' && (
        <LayoutBlock page={page} mode={mode} deckId={deckId} />
      )}
    </div>
  )
}
