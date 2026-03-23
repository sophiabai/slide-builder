import type { Theme } from '../types/theme'
import type { CSSProperties } from 'react'

export function themeToCSS(theme: Theme): CSSProperties {
  const isDark = theme.mode === 'dark'
  return {
    '--slide-bg': isDark ? '#0F0F0F' : 'oklch(0.99 0.01 102)',
    '--slide-text': isDark ? '#F5F5F5' : '#1A1A1A',
    '--slide-text-secondary': isDark ? '#A0A0A0' : '#6B7280',
    '--slide-accent': theme.accentColor,
    '--slide-font': fontFamilyValue(theme.fontFamily),
    '--slide-surface': isDark ? '#1A1A1A' : '#F5F5F5',
    '--slide-border': isDark ? '#2A2A2A' : '#E5E7EB',
  } as CSSProperties
}

function fontFamilyValue(font: Theme['fontFamily']): string {
  if (font === 'system') return 'system-ui, -apple-system, sans-serif'
  if (font === 'Degular') return 'degular, system-ui, sans-serif'
  return `'${font}', system-ui, sans-serif`
}
