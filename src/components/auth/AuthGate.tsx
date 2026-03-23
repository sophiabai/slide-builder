import { type ReactNode, lazy, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'

const AuthPage = lazy(() => import('@/app/routes/auth'))

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/present/')) {
    return <>{children}</>
  }

  if (!user) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <AuthPage />
      </Suspense>
    )
  }

  return <>{children}</>
}
