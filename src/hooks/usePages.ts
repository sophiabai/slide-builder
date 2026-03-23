import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as pagesApi from '@/lib/api/pages'
import type { Page, PageInsert, PageUpdate } from '@/lib/types/database'

export function usePages(deckId: string) {
  return useQuery({
    queryKey: ['pages', deckId],
    queryFn: () => pagesApi.fetchPages(deckId),
    staleTime: 30_000,
    enabled: !!deckId,
  })
}

export function useCreatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (page: PageInsert) => pagesApi.createPage(page),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages', data.deck_id] })
    },
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (update: { id: string; deck_id: string } & PageUpdate) =>
      pagesApi.updatePage(update),
    onMutate: async (updatedPage) => {
      await queryClient.cancelQueries({ queryKey: ['pages', updatedPage.deck_id] })
      const previous = queryClient.getQueryData<Page[]>(['pages', updatedPage.deck_id])
      queryClient.setQueryData<Page[]>(['pages', updatedPage.deck_id], (old) =>
        old?.map((p) =>
          p.id === updatedPage.id ? { ...p, ...updatedPage } : p
        )
      )
      return { previous, deckId: updatedPage.deck_id }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['pages', context.deckId], context.previous)
      }
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ['pages', vars.deck_id] })
    },
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, deckId }: { id: string; deckId: string }) =>
      pagesApi.deletePage(id),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['pages', vars.deckId] })
    },
  })
}

export function useReorderPages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ deckId, orderedIds }: { deckId: string; orderedIds: string[] }) =>
      pagesApi.reorderPages(deckId, orderedIds),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['pages', vars.deckId] })
    },
  })
}

export function useDuplicatePage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (page: Page) => pagesApi.duplicatePage(page),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pages', data.deck_id] })
    },
  })
}
