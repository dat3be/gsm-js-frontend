import { Suspense } from 'react'
import AllPorts from '@/components/AllPorts'

export default function PortsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Ports</h1>
        <Suspense fallback={<div>Loading ports...</div>}>
          <AllPorts />
        </Suspense>
      </main>
    </div>
  )
}

