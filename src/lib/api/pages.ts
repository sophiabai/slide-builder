import { supabase } from '../supabase'
import type { Page, PageInsert, PageUpdate } from '../types/database'

export async function fetchPages(deckId: string): Promise<Page[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('deck_id', deckId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as Page[]
}

export async function createPage(page: PageInsert): Promise<Page> {
  const { data, error } = await supabase
    .from('pages')
    .insert(page)
    .select()
    .single()
  if (error) throw error
  return data as Page
}

export async function updatePage(update: { id: string; deck_id: string } & PageUpdate): Promise<Page> {
  const { id, deck_id: _deckId, ...fields } = update
  const { data, error } = await supabase
    .from('pages')
    .update(fields)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Page
}

export async function deletePage(id: string): Promise<void> {
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) throw error
}

export async function reorderPages(deckId: string, orderedIds: string[]): Promise<void> {
  const { error } = await supabase.rpc('reorder_pages', {
    deck_id: deckId,
    page_ids: orderedIds,
  })
  if (error) throw error
}

export async function duplicatePage(page: Page): Promise<Page> {
  const newPage: PageInsert = {
    deck_id: page.deck_id,
    sort_order: page.sort_order + 1,
    layout: page.layout,
    eyebrow: page.eyebrow,
    title: page.title,
    body_text: page.body_text,
    block: page.block,
    ai_generated: false,
  }
  return createPage(newPage)
}
