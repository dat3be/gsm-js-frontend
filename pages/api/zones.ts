import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const zonesFilePath = path.join(process.cwd(), 'data', 'zones.json'); // Ensure zones.json exists in the `data` directory.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch and refresh zones with updated portCount
      const zonesData = await fs.readFile(zonesFilePath, 'utf-8');
      const zones = JSON.parse(zonesData);

      const updatedZones = await Promise.all(
        zones.map(async (zone: any) => {
          try {
            const response = await fetch(`${zone.apiEndpoint}/ports`);
            const data = await response.json();
            if (data && Array.isArray(data.ports)) {
              zone.portCount = data.ports.length;
            }
          } catch (error) {
            console.error(`Error refreshing ports for zone ${zone.name}:`, error);
            zone.portCount = 0; // Default to 0 if fetching fails
          }
          return zone;
        })
      );

      await fs.writeFile(zonesFilePath, JSON.stringify(updatedZones, null, 2), 'utf-8');
      res.status(200).json(updatedZones);
    } else if (req.method === 'POST') {
      // Add a new zone
      const { name, apiEndpoint } = req.body;

      if (!name || !apiEndpoint) {
        return res.status(400).json({ error: 'Name and API Endpoint are required.' });
      }

      // Fetch ports to determine portCount
      let portCount = 0;
      try {
        const response = await fetch(`${apiEndpoint}/ports`);
        const data = await response.json();
        if (data && Array.isArray(data.ports)) {
          portCount = data.ports.length;
        }
      } catch (error) {
        console.error('Error fetching ports from API:', error);
        return res.status(500).json({ error: 'Failed to fetch ports from API endpoint.' });
      }

      const zonesData = await fs.readFile(zonesFilePath, 'utf-8');
      const zones = JSON.parse(zonesData);

      // Generate the next ID (starting from 1)
      const nextId = zones.length > 0 ? Math.max(...zones.map((zone: any) => zone.id)) + 1 : 1;

      // Add the new zone
      const newZone = {
        id: nextId,
        name,
        apiEndpoint,
        portCount,
      };

      zones.push(newZone);

      await fs.writeFile(zonesFilePath, JSON.stringify(zones, null, 2), 'utf-8');
      res.status(201).json(newZone);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling zones API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
