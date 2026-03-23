import type { Block } from './block'
import type { Theme } from './theme'

export interface Deck {
  id: string
  user_id: string
  title: string
  theme: Theme
  ai_generation_metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  pages?: { count: number }[]
}

export interface Page {
  id: string
  deck_id: string
  sort_order: number
  layout: 'text' | 'text-block' | 'block'
  eyebrow: string
  title: string
  body_text: string
  block: Block | null
  ai_generated: boolean
  created_at: string
  updated_at: string
}

export type DeckInsert = Omit<Deck, 'id' | 'created_at' | 'updated_at' | 'pages'>
export type DeckUpdate = Partial<Omit<Deck, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'pages'>>
export type PageInsert = Omit<Page, 'id' | 'created_at' | 'updated_at'>
export type PageUpdate = Partial<Omit<Page, 'id' | 'deck_id' | 'created_at' | 'updated_at'>>

export type PageLayout = Page['layout']
