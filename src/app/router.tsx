import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('./routes/dashboard'))
const DeckEditorPage = lazy(() => import('./routes/deck-editor'))
const PresentationPage = lazy(() => import('./routes/presentation'))
const AuthPage = lazy(() => import('./routes/auth'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<Loading />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: '/deck/:deckId',
    element: (
      <Suspense fallback={<Loading />}>
        <DeckEditorPage />
      </Suspense>
    ),
  },
  {
    path: '/present/:deckId',
    element: (
      <Suspense fallback={<Loading />}>
        <PresentationPage />
      </Suspense>
    ),
  },
  {
    path: '/present/:deckId/:pageIndex',
    element: (
      <Suspense fallback={<Loading />}>
        <PresentationPage />
      </Suspense>
    ),
  },
])
