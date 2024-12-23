'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Statistics, sampleStatistics } from '../types/port'

export default function StatisticsSection() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Simulating API call with sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(sampleStatistics)
      } catch (err) {
        console.error('Error fetching statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="h-24 flex items-center justify-center">Loading statistics...</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Total Ports</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold">{stats.totalPorts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Online Ports</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-green-600">{stats.onlinePorts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Offline Ports</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold text-red-600">{stats.offlinePorts}</div>
        </CardContent>
      </Card>
    </div>
  )
}

