import { useParams } from 'react-router-dom'
import { PresentationShell } from '@/components/presentation/PresentationShell'

export default function PresentationPage() {
  const { deckId, pageIndex } = useParams<{ deckId: string; pageIndex?: string }>()

  if (!deckId) {
    return <div className="min-h-screen flex items-center justify-center">Deck not found</div>
  }

  return (
    <PresentationShell
      deckId={deckId}
      initialPageIndex={pageIndex ? parseInt(pageIndex, 10) : 0}
    />
  )
}
