import { useMemo, useRef, useCallback } from 'react'
import { useUpdatePage } from './usePages'
import { useEditorStore } from '@/stores/editor-store'
import type { PageUpdate } from '@/lib/types/database'

export function useAutoSave(pageId: string, deckId: string) {
  const updatePage = useUpdatePage()
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const save = useCallback(
    async (updates: PageUpdate) => {
      setSaveStatus(true)
      try {
        await updatePage.mutateAsync({ id: pageId, deck_id: deckId, ...updates })
        setSaveStatus(false, new Date())
      } catch {
        setSaveStatus(false)
      }
    },
    [pageId, deckId, updatePage, setSaveStatus]
  )

  const debouncedSave = useMemo(() => {
    return (updates: PageUpdate) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => save(updates), 1000)
    }
  }, [save])

  const immediateSave = useCallback(
    (updates: PageUpdate) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      save(updates)
    },
    [save]
  )

  return { debouncedSave, immediateSave }
}
