import { Suspense } from 'react'
import Logs from '@/components/Logs'

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Logs</h1>
        <Suspense fallback={<div>Loading logs...</div>}>
          <Logs />
        </Suspense>
      </main>
    </div>
  )
}

