import { create } from 'zustand'

interface EditorStore {
  activePageId: string | null
  setActivePageId: (id: string | null) => void

  isSaving: boolean
  lastSavedAt: Date | null
  setSaveStatus: (saving: boolean, timestamp?: Date) => void

  isThemePanelOpen: boolean
  toggleThemePanel: () => void
  setThemePanelOpen: (open: boolean) => void

  blockEditingPageId: string | null
  setBlockEditing: (pageId: string | null) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  activePageId: null,
  setActivePageId: (id) => set({ activePageId: id }),

  isSaving: false,
  lastSavedAt: null,
  setSaveStatus: (saving, timestamp) =>
    set({
      isSaving: saving,
      ...(timestamp ? { lastSavedAt: timestamp } : {}),
    }),

  isThemePanelOpen: false,
  toggleThemePanel: () => set((s) => ({ isThemePanelOpen: !s.isThemePanelOpen })),
  setThemePanelOpen: (open) => set({ isThemePanelOpen: open }),

  blockEditingPageId: null,
  setBlockEditing: (pageId) => set({ blockEditingPageId: pageId }),
}))
