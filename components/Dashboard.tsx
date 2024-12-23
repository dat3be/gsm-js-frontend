'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import HistoricalLog from './HistoricalLog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import { Zone, sampleZones } from '../types/port'

export default function Dashboard() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Simulating API calls with sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setZones(sampleZones)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulating API calls with sample data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setZones(sampleZones)
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Zones Overview</h2>
          <Link href="/zones">
            <Button variant="outline">Manage Zones</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <Card key={zone.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{zone.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">Total Ports: {zone.portCount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Recent Port Activity</h2>
          <Link href="/logs">
            <Button variant="outline">View All Logs</Button>
          </Link>
        </div>
        <HistoricalLog limit={5} />
      </div>
    </div>
  )
}

