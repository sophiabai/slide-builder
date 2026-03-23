import { supabase } from '../supabase'
import type { Deck, DeckInsert, DeckUpdate } from '../types/database'

export async function fetchDecks(): Promise<Deck[]> {
  const { data, error } = await supabase
    .from('decks')
    .select('*, pages(count)')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data as Deck[]
}

export async function fetchDeck(id: string): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Deck
}

export async function createDeck(deck: DeckInsert): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .insert(deck)
    .select()
    .single()
  if (error) throw error
  return data as Deck
}

export async function updateDeck(id: string, updates: DeckUpdate): Promise<Deck> {
  const { data, error } = await supabase
    .from('decks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Deck
}

export async function deleteDeck(id: string): Promise<void> {
  const { error } = await supabase.from('decks').delete().eq('id', id)
  if (error) throw error
}

export async function duplicateDeck(id: string): Promise<Deck> {
  const deck = await fetchDeck(id)
  const { data: pages, error: pagesError } = await supabase
    .from('pages')
    .select('*')
    .eq('deck_id', id)
    .order('sort_order', { ascending: true })
  if (pagesError) throw pagesError

  const newDeck = await createDeck({
    user_id: deck.user_id,
    title: `${deck.title} (Copy)`,
    theme: deck.theme,
  })

  if (pages && pages.length > 0) {
    const newPages = pages.map((p: Record<string, unknown>) => ({
      deck_id: newDeck.id,
      sort_order: p.sort_order,
      layout: p.layout,
      eyebrow: p.eyebrow,
      title: p.title,
      body_text: p.body_text,
      block: p.block,
      ai_generated: p.ai_generated,
    }))
    const { error: insertError } = await supabase.from('pages').insert(newPages)
    if (insertError) throw insertError
  }

  return newDeck
}
