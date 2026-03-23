import { useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeck } from '@/hooks/useDecks'
import { usePages, useCreatePage, useDeletePage, useDuplicatePage } from '@/hooks/usePages'
import { useEditorStore } from '@/stores/editor-store'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Topbar } from './Topbar'
import { PageSidebar } from './PageSidebar'
import { Canvas } from './Canvas'
import { ThemePanel } from './ThemePanel'

interface EditorShellProps {
  deckId: string
}

export function EditorShell({ deckId }: EditorShellProps) {
  const navigate = useNavigate()
  const { data: deck, isLoading: deckLoading } = useDeck(deckId)
  const { data: pages, isLoading: pagesLoading } = usePages(deckId)
  const { activePageId, setActivePageId, isThemePanelOpen, setSaveStatus } = useEditorStore()
  const createPage = useCreatePage()
  const deletePage = useDeletePage()
  const duplicatePage = useDuplicatePage()

  useEffect(() => {
    if (pages && pages.length > 0 && !activePageId) {
      setActivePageId(pages[0].id)
    }
  }, [pages, activePageId, setActivePageId])

  const activePage = pages?.find((p) => p.id === activePageId) ?? pages?.[0] ?? null
  const activeIndex = pages?.findIndex((p) => p.id === activePage?.id) ?? -1

  const handleNavigateUp = useCallback(() => {
    if (!pages || activeIndex <= 0) return
    setActivePageId(pages[activeIndex - 1].id)
  }, [pages, activeIndex, setActivePageId])

  const handleNavigateDown = useCallback(() => {
    if (!pages || activeIndex >= pages.length - 1) return
    setActivePageId(pages[activeIndex + 1].id)
  }, [pages, activeIndex, setActivePageId])

  const shortcuts = useMemo(() => ({
    'mod+s': () => setSaveStatus(false, new Date()),
    'mod+n': () => {
      const sortOrder = activeIndex >= 0 ? activeIndex + 1 : (pages?.length ?? 0)
      createPage.mutateAsync({
        deck_id: deckId,
        sort_order: sortOrder,
        layout: 'text',
        eyebrow: '',
        title: '',
        body_text: '',
        block: null,
        ai_generated: false,
      }).then((p) => setActivePageId(p.id))
    },
    'mod+d': () => {
      if (activePage) duplicatePage.mutateAsync(activePage).then((p) => setActivePageId(p.id))
    },
    'mod+backspace': () => {
      if (!activePage || !pages) return
      const next = pages[activeIndex + 1] ?? pages[activeIndex - 1] ?? null
      deletePage.mutate({ id: activePage.id, deckId })
      setActivePageId(next?.id ?? null)
    },
    'mod+enter': () => navigate(`/present/${deckId}`),
    'arrowup': handleNavigateUp,
    'arrowdown': handleNavigateDown,
  }), [deckId, activePage, pages, activeIndex, navigate, createPage, deletePage, duplicatePage, setActivePageId, setSaveStatus, handleNavigateUp, handleNavigateDown])

  useKeyboardShortcuts(shortcuts)

  if (deckLoading || pagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Deck not found
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Topbar deck={deck} />

      <div className="flex-1 flex min-h-0">
        <PageSidebar
          deckId={deckId}
          pages={pages ?? []}
          activePageId={activePage?.id ?? null}
          theme={deck.theme}
        />

        <Canvas
          page={activePage}
          theme={deck.theme}
          deckId={deckId}
        />
      </div>

      {isThemePanelOpen && <ThemePanel deck={deck} />}
    </div>
  )
}
