import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { ToastProvider } from '@/components/ui/toast'
import { AuthGate } from '@/components/auth/AuthGate'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthGate>
          <RouterProvider router={router} />
        </AuthGate>
      </ToastProvider>
    </QueryClientProvider>
  )
}
