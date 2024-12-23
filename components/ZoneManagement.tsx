"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Zone } from "../types/port";
import { Loader2 } from "lucide-react";

export default function ZoneManagement() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZone, setNewZone] = useState({ name: "", apiEndpoint: "" });
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/zones");
      if (!response.ok) throw new Error("Failed to fetch zones.");
      const data = await response.json();
      setZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async () => {
    if (!newZone.name || !newZone.apiEndpoint) {
      alert("Please provide both a name and API endpoint.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch("/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      });
  
      if (!response.ok) throw new Error("Failed to add zone.");
      const createdZone = await response.json();
  
      setZones((prevZones) => [...prevZones, createdZone]);
      setNewZone({ name: "", apiEndpoint: "" });
    } catch (error) {
      console.error("Error adding zone:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleUpdateZone = async () => {
    if (!editingZone) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/zones/${editingZone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingZone),
      });

      if (!response.ok) throw new Error("Failed to update zone.");
      const updatedZone = await response.json();

      setZones((prevZones) =>
        prevZones.map((zone) => (zone.id === updatedZone.id ? updatedZone : zone))
      );
      setEditingZone(null);
    } catch (error) {
      console.error("Error updating zone:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/zones/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete zone.");
      setZones((prevZones) => prevZones.filter((zone) => zone.id !== id));
    } catch (error) {
      console.error("Error deleting zone:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Zone Name"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
            />
            <Input
              placeholder="API Endpoint"
              value={newZone.apiEndpoint}
              onChange={(e) =>
                setNewZone({ ...newZone, apiEndpoint: e.target.value })
              }
            />
            <Button onClick={handleAddZone} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
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
                        onChange={(e) =>
                          setEditingZone({
                            ...editingZone,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      zone.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingZone?.id === zone.id ? (
                      <Input
                        value={editingZone.apiEndpoint}
                        onChange={(e) =>
                          setEditingZone({
                            ...editingZone,
                            apiEndpoint: e.target.value,
                          })
                        }
                      />
                    ) : (
                      zone.apiEndpoint
                    )}
                  </TableCell>
                  <TableCell>{zone.portCount}</TableCell>
                  <TableCell>
                    {editingZone?.id === zone.id ? (
                      <Button onClick={handleUpdateZone} disabled={loading}>
                        {loading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => setEditingZone(zone)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteZone(zone.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
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
  );
}
