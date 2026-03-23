import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCreatePage, useReorderPages, useDeletePage, useDuplicatePage } from '@/hooks/usePages'
import { useEditorStore } from '@/stores/editor-store'
import { PageThumbnail } from './PageThumbnail'
import { Button } from '@/components/ui/button'
import { Plus, Type, Columns2, Square } from 'lucide-react'
import type { Page, PageLayout } from '@/lib/types/database'
import type { Theme } from '@/lib/types/theme'
import { cn } from '@/lib/utils'

interface PageSidebarProps {
  deckId: string
  pages: Page[]
  activePageId: string | null
  theme: Theme
}

const LAYOUTS: { value: PageLayout; label: string; icon: typeof Type }[] = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'text-block', label: 'Text + Block', icon: Columns2 },
  { value: 'block', label: 'Block', icon: Square },
]

export function PageSidebar({ deckId, pages, activePageId, theme }: PageSidebarProps) {
  const { setActivePageId } = useEditorStore()
  const createPage = useCreatePage()
  const reorderPages = useReorderPages()
  const deletePage = useDeletePage()
  const duplicatePage = useDuplicatePage()
  const [showLayoutPicker, setShowLayoutPicker] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = pages.findIndex((p) => p.id === active.id)
    const newIndex = pages.findIndex((p) => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = [...pages]
    const [moved] = newOrder.splice(oldIndex, 1)
    newOrder.splice(newIndex, 0, moved)

    reorderPages.mutate({
      deckId,
      orderedIds: newOrder.map((p) => p.id),
    })
  }

  async function handleAddPage(layout: PageLayout) {
    const activeIndex = pages.findIndex((p) => p.id === activePageId)
    const sortOrder = activeIndex >= 0 ? activeIndex + 1 : pages.length

    const newPage = await createPage.mutateAsync({
      deck_id: deckId,
      sort_order: sortOrder,
      layout,
      eyebrow: '',
      title: '',
      body_text: '',
      block: null,
      ai_generated: false,
    })
    setActivePageId(newPage.id)
    setShowLayoutPicker(false)
  }

  function handleDeletePage(page: Page) {
    const idx = pages.findIndex((p) => p.id === page.id)
    deletePage.mutate({ id: page.id, deckId })
    if (page.id === activePageId) {
      const next = pages[idx + 1] ?? pages[idx - 1] ?? null
      setActivePageId(next?.id ?? null)
    }
  }

  async function handleDuplicatePage(page: Page) {
    const newPage = await duplicatePage.mutateAsync(page)
    setActivePageId(newPage.id)
  }

  return (
    <aside className="w-56 border-r border-border flex flex-col shrink-0 bg-card">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={index}
                isActive={page.id === activePageId}
                theme={theme}
                onClick={() => setActivePageId(page.id)}
                onDelete={() => handleDeletePage(page)}
                onDuplicate={() => handleDuplicatePage(page)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="p-3 border-t border-border relative">
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={() => setShowLayoutPicker(!showLayoutPicker)}
        >
          <Plus className="h-4 w-4" />
          Add Page
        </Button>

        {showLayoutPicker && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-md border border-border bg-popover shadow-lg p-2 space-y-1">
            {LAYOUTS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors cursor-pointer'
                )}
                onClick={() => handleAddPage(value)}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
