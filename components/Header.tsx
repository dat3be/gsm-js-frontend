import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function RefreshButton() {
  const handleRefresh = () => {
    // Implement refresh functionality here
    console.log('Refreshing data...')
  }

  return (
    <header className="bg-white shadow">
      <div className="w-full px-4 py-4 flex justify-end items-center">
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
    </header>
  )
}

