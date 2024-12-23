'use client';

import { useState, useEffect } from 'react';
import PortCard from './PortCard';
import PortModal from './PortModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Port, Zone } from '../types/port';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AllPorts() {
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Fetch zones from zones.json
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/zones');
        if (!response.ok) throw new Error('Failed to fetch zones.');
        const data = await response.json();
        setZones(data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  // Fetch ports for the selected zone
  useEffect(() => {
    const fetchPortsFromZone = async () => {
      if (!selectedZone) {
        setPorts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${selectedZone.apiEndpoint}/ports`);
        if (!response.ok) throw new Error('Failed to fetch ports from zone');
        const data = await response.json();
        setPorts(data.ports || []);
      } catch (error) {
        console.error(`Error fetching ports from zone ${selectedZone.id}:`, error);
        setPorts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortsFromZone();
  }, [selectedZone]);

  // Automatically fetch port info when started
  useEffect(() => {
    if (isRunning) {
      fetchAllPortInfo();
    }
  }, [isRunning]);

  const fetchAllPortInfo = async () => {
    for (const port of ports) {
      if (!isRunning) break; // Stop if paused
      await fetchPortInfo(port.port);
    }
  };

  const fetchPortInfo = async (portName: string) => {
    try {
      const response = await fetch('/api/get-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port: portName }),
      });

      if (!response.ok) throw new Error(`Failed to fetch info for port ${portName}`);
      const data = await response.json();

      setPorts((prevPorts) =>
        prevPorts.map((port) =>
          port.port === portName
            ? {
                ...port,
                phoneNumber: data.phone_number,
                balance: data.balance,
                status: 'Online',
              }
            : port
        )
      );
    } catch (error) {
      console.error(`Error fetching info for port ${portName}:`, error);

      setPorts((prevPorts) =>
        prevPorts.map((port) =>
          port.port === portName ? { ...port, status: 'Offline' } : port
        )
      );
    }
  };

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const handleRefresh = async () => {
    if (!selectedZone) return;

    setLoading(true);
    try {
      const response = await fetch(`${selectedZone.apiEndpoint}/ports`);
      if (!response.ok) throw new Error('Failed to refresh ports');
      const data = await response.json();
      setPorts(data.ports || []);
    } catch (error) {
      console.error('Error refreshing ports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedPort(null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Select a Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedZone?.id || ''}
            onValueChange={(value) => setSelectedZone(zones.find((z) => z.id === value) || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a zone" />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedZone && (
            <p className="mt-2 text-sm text-muted-foreground">
              API Endpoint: {selectedZone.apiEndpoint}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by port or phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex items-center space-x-4">
          <Button onClick={toggleRunning}>
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Loading ports...
          </div>
        ) : ports.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No ports available.
          </div>
        ) : (
          ports.map((port) => (
            <PortCard key={port.port} port={port} onClick={() => handlePortClick(port)} />
          ))
        )}
      </div>

      {selectedPort && <PortModal port={selectedPort} onClose={handleCloseModal} />}
    </div>
  );
}
