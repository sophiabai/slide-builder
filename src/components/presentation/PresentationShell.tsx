import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeck } from '@/hooks/useDecks'
import { usePages } from '@/hooks/usePages'
import { SlideView } from './SlideView'

interface PresentationShellProps {
  deckId: string
  initialPageIndex: number
}

export function PresentationShell({ deckId, initialPageIndex }: PresentationShellProps) {
  const navigate = useNavigate()
  const { data: deck, isLoading: deckLoading } = useDeck(deckId)
  const { data: pages, isLoading: pagesLoading } = usePages(deckId)
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex)
  const [transitioning, setTransitioning] = useState(false)
  const touchStartX = useRef(0)

  const totalPages = pages?.length ?? 0

  const next = useCallback(() => {
    if (currentIndex < totalPages - 1 && !transitioning) {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((i) => i + 1)
        setTransitioning(false)
      }, 300)
    }
  }, [currentIndex, totalPages, transitioning])

  const prev = useCallback(() => {
    if (currentIndex > 0 && !transitioning) {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((i) => i - 1)
        setTransitioning(false)
      }, 300)
    }
  }, [currentIndex, transitioning])

  const exitPresentation = useCallback(() => {
    navigate(`/deck/${deckId}`)
  }, [navigate, deckId])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      if (e.key === 'Escape') exitPresentation()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev, exitPresentation])

  // URL sync
  useEffect(() => {
    window.history.replaceState(null, '', `/present/${deckId}/${currentIndex}`)
  }, [currentIndex, deckId])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff > 80) prev()
    else if (diff < -80) next()
  }

  function handleClick(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.25) prev()
    else if (x > rect.width * 0.75) next()
  }

  if (deckLoading || pagesLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!deck || !pages || pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white/60">
        No slides to present
      </div>
    )
  }

  const safeIndex = Math.min(currentIndex, pages.length - 1)
  const currentPage = pages[safeIndex]

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden cursor-none"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <SlideView page={currentPage} theme={deck.theme} />
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 hover:opacity-100 transition-opacity cursor-default">
        {pages.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              i === safeIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(i)
            }}
          />
        ))}
      </div>

      <div className="fixed top-4 right-4 opacity-0 hover:opacity-100 transition-opacity cursor-default">
        <span className="text-white/40 text-xs">
          {safeIndex + 1} / {pages.length} &middot; ESC to exit
        </span>
      </div>
    </div>
  )
}
