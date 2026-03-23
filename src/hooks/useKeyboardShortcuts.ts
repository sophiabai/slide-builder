import { useEffect } from 'react'

interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      let key = ''

      if (mod) key += 'mod+'
      if (e.shiftKey) key += 'shift+'
      key += e.key.toLowerCase()

      const handler = shortcuts[key]
      if (handler) {
        e.preventDefault()
        handler(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}
