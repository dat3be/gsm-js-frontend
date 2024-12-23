import { Suspense } from 'react'
import Dashboard from '@/components/Dashboard'
import NotificationSystem from '@/components/NotificationSystem'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <Dashboard />
        </Suspense>
      </main>
      <NotificationSystem />
    </div>
  )
}

