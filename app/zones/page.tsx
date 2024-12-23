import { Suspense } from 'react'
import ZoneManagement from '@/components/ZoneManagement'

export default function ZonesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Zone Management</h1>
        <Suspense fallback={<div>Loading zones...</div>}>
          <ZoneManagement />
        </Suspense>
      </main>
    </div>
  )
}

