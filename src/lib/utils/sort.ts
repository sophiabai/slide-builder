import type { Page } from '../types/database'

export function insertAtPosition(pages: Page[], afterIndex: number): number {
  if (pages.length === 0) return 0
  return afterIndex + 1
}

export function recomputeSortOrders(pages: Page[]): Page[] {
  return pages.map((page, index) => ({ ...page, sort_order: index }))
}
