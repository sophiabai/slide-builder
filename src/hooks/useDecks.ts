import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as decksApi from '@/lib/api/decks'
import type { DeckInsert, DeckUpdate } from '@/lib/types/database'

export function useDecks() {
  return useQuery({
    queryKey: ['decks'],
    queryFn: decksApi.fetchDecks,
    staleTime: 30_000,
  })
}

export function useDeck(id: string) {
  return useQuery({
    queryKey: ['deck', id],
    queryFn: () => decksApi.fetchDeck(id),
    staleTime: 30_000,
    enabled: !!id,
  })
}

export function useCreateDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (deck: DeckInsert) => decksApi.createDeck(deck),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    },
  })
}

export function useUpdateDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DeckUpdate }) =>
      decksApi.updateDeck(id, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(['deck', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    },
  })
}

export function useDeleteDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: decksApi.deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    },
  })
}

export function useDuplicateDeck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: decksApi.duplicateDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    },
  })
}
