'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LogEntry, sampleLogEntries } from '../types/port'

interface HistoricalLogProps {
  limit?: number
}

export default function HistoricalLog({ limit }: HistoricalLogProps) {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogEntries = async () => {
      try {
        setLoading(true)
        // Simulating API call with sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setLogEntries(limit ? sampleLogEntries.slice(0, limit) : sampleLogEntries)
        setError(null)
      } catch (err) {
        console.error('Error fetching log entries:', err)
        setError('Failed to fetch log entries. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchLogEntries()
    const interval = setInterval(fetchLogEntries, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [limit])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p>Loading log entries...</p>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{entry.portNumber}</TableCell>
                  <TableCell>{entry.event}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

