export interface Theme {
  mode: 'dark' | 'light'
  accentColor: string
  fontFamily: 'Degular' | 'Inter' | 'Space Grotesk' | 'IBM Plex Sans' | 'JetBrains Mono' | 'system'
}

export const DEFAULT_THEME: Theme = {
  mode: 'dark',
  accentColor: '#6366F1',
  fontFamily: 'Degular',
}

export const FONT_OPTIONS: Theme['fontFamily'][] = [
  'Degular',
  'Inter',
  'Space Grotesk',
  'IBM Plex Sans',
  'JetBrains Mono',
  'system',
]

export const ACCENT_COLORS = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F43F5E', // rose
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
]
