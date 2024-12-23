'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw } from 'lucide-react'
import { LogEntry, sampleLogEntries } from '../types/port'

export default function Logs() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const filtered = logEntries.filter(entry =>
      entry.portNumber.toLowerCase().includes(search.toLowerCase()) ||
      entry.event.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredEntries(filtered)
  }, [logEntries, search])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      // Simulating API call with sample data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLogEntries(sampleLogEntries)
    } catch (error) {
      console.error('Error fetching log entries:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Button onClick={fetchLogs} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <p>Loading log entries...</p>
            </div>
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
                {filteredEntries.map((entry) => (
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
    </div>
  )
}

