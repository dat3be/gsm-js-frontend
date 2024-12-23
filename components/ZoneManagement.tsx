'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Zone, sampleZones } from '../types/port'
import { Loader2 } from 'lucide-react'

export default function ZoneManagement() {
  const [zones, setZones] = useState<Zone[]>([])
  const [newZone, setNewZone] = useState({ name: '', apiEndpoint: '' })
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchZones()
  }, [])

  const fetchZones = async () => {
    setLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setZones(sampleZones)
    } catch (error) {
      console.error('Error fetching zones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddZone = async () => {
    if (newZone.name && newZone.apiEndpoint) {
      setLoading(true)
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        const portCount = Math.floor(Math.random() * 128) + 32 // Random port count between 32 and 160
        const newId = (Math.max(...zones.map(z => parseInt(z.id))) + 1).toString()
        const createdZone: Zone = { id: newId, ...newZone, portCount }
        setZones([...zones, createdZone])
        setNewZone({ name: '', apiEndpoint: '' })
      } catch (error) {
        console.error('Error adding zone:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUpdateZone = async () => {
    if (editingZone) {
      setLoading(true)
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setZones(zones.map(z => z.id === editingZone.id ? editingZone : z))
        setEditingZone(null)
      } catch (error) {
        console.error('Error updating zone:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteZone = async (id: string) => {
    setLoading(true)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setZones(zones.filter(z => z.id !== id))
    } catch (error) {
      console.error('Error deleting zone:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Zone Name"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
            />
            <Input
              placeholder="API Endpoint"
              value={newZone.apiEndpoint}
              onChange={(e) => setNewZone({ ...newZone, apiEndpoint: e.target.value })}
            />
            <Button onClick={handleAddZone} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Zone
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>API Endpoint</TableHead>
                <TableHead>Port Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.id}</TableCell>
                  <TableCell>
                    {editingZone?.id === zone.id ? (
                      <Input
                        value={editingZone.name}
                        onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
                      />
                    ) : (
                      zone.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingZone?.id === zone.id ? (
                      <Input
                        value={editingZone.apiEndpoint}
                        onChange={(e) => setEditingZone({ ...editingZone, apiEndpoint: e.target.value })}
                      />
                    ) : (
                      zone.apiEndpoint
                    )}
                  </TableCell>
                  <TableCell>{zone.portCount}</TableCell>
                  <TableCell>
                    {editingZone?.id === zone.id ? (
                      <Button onClick={handleUpdateZone} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" className="mr-2" onClick={() => setEditingZone(zone)}>Edit</Button>
                        <Button variant="destructive" onClick={() => handleDeleteZone(zone.id)} disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

