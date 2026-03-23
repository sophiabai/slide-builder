import { DeckGrid } from '@/components/dashboard/DeckGrid'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogOut, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateDeckDialog } from '@/components/dashboard/CreateDeckDialog'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Slide Builder</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Your Decks</h2>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Deck
          </Button>
        </div>
        <DeckGrid />
      </main>

      <CreateDeckDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
