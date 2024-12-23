'use client'

import { useState, useEffect } from 'react'
import PortCard from './PortCard'
import PortModal from './PortModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import { Port, PortInfoResponse, samplePorts, Zone, sampleZones } from '../types/port'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AllPorts() {
  const [ports, setPorts] = useState<Port[]>([])
  const [filteredPorts, setFilteredPorts] = useState<Port[]>([])
  const [selectedPort, setSelectedPort] = useState<Port | null>(null)
  const [loading, setLoading] = useState(true)
  const [portInfoLoading, setPortInfoLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [zones, setZones] = useState<Zone[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Simulating API call with sample data
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPorts(samplePorts)
        setZones(sampleZones)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedZone) {
      const zonePorts = ports.filter(port => port.zoneId === selectedZone.id)
      const filtered = zonePorts.filter(port => {
        const matchesFilter = filter === 'all' || port.status.toLowerCase() === filter.toLowerCase()
        const matchesSearch = port.port.toLowerCase().includes(search.toLowerCase()) ||
          (port.phoneNumber && port.phoneNumber.includes(search))
        return matchesFilter && matchesSearch
      })
      setFilteredPorts(filtered)
    } else {
      setFilteredPorts([])
    }
  }, [ports, filter, search, selectedZone])

  const fetchPortInfo = async (port: string) => {
    try {
      setPortInfoLoading(port)
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const isOnline = Math.random() > 0.5
      const data: PortInfoResponse = {
        success: true,
        data: {
          status: isOnline ? 'Online' : 'Offline',
          phoneNumber: isOnline ? `${Object.keys(operatorCodeMap)[Math.floor(Math.random() * Object.keys(operatorCodeMap).length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}` : '',
          balance: isOnline ? Math.floor(Math.random() * 500000 / 1000) * 1000 : 0
        }
      }
    
      if (data.success && data.data) {
        setPorts(currentPorts =>
          currentPorts.map(p =>
            p.port === port
              ? { 
                ...p, 
                status: data.data.status, 
                phoneNumber: data.data.phoneNumber, 
                balance: data.data.balance 
              }
            : p
          )
        )
      } else {
        throw new Error(data.error || 'Failed to fetch port info')
      }
    } catch (error) {
      console.error(`Error fetching info for port ${port}:`, error)
      // Optionally, update the port's status to indicate the error
      setPorts(currentPorts =>
        currentPorts.map(p =>
          p.port === port
            ? { ...p, status: 'Error' }
            : p
        )
      )
    } finally {
      setPortInfoLoading(null)
    }
  }

  const handlePortClick = async (port: Port) => {
    setSelectedPort(port)
    if (!port.phoneNumber || port.balance === undefined) {
      await fetchPortInfo(port.port)
    }
  }

  const handleCloseModal = () => {
    setSelectedPort(null)
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      // Simulating API call with sample data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPorts(samplePorts)
    } catch (error) {
      console.error('Error refreshing ports:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Select a Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedZone?.id || ''} onValueChange={(value) => setSelectedZone(zones.find(z => z.id === value) || null)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedZone && (
            <p className="mt-2 text-sm text-muted-foreground">API Endpoint: {selectedZone.apiEndpoint}</p>
          )}
        </CardContent>
      </Card>

      {selectedZone && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search by port or phone number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ports</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRefresh} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {loading ? (
              Array.from({ length: selectedZone.portCount }).map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
              ))
            ) : filteredPorts.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No ports match the current filter and search criteria.
              </div>
            ) : (
              filteredPorts.map((port) => (
                <div key={port.port} className="h-40">
                  <PortCard 
                    port={port} 
                    onClick={() => handlePortClick(port)}
                    loading={portInfoLoading === port.port}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {selectedPort && (
        <PortModal port={selectedPort} onClose={handleCloseModal} />
      )}
    </div>
  )
}

