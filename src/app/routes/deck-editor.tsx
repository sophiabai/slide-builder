import { useParams } from 'react-router-dom'
import { EditorShell } from '@/components/editor/EditorShell'

export default function DeckEditorPage() {
  const { deckId } = useParams<{ deckId: string }>()

  if (!deckId) {
    return <div className="min-h-screen flex items-center justify-center">Deck not found</div>
  }

  return <EditorShell deckId={deckId} />
}
