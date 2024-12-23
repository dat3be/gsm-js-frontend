import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const zonesFilePath = path.join(process.cwd(), 'data', 'zones.json'); // Ensure the file exists in this directory.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query; // Get the ID from the URL

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid Zone ID.' });
    }

    const zonesData = await fs.readFile(zonesFilePath, 'utf-8');
    const zones = JSON.parse(zonesData);

    if (req.method === 'DELETE') {
      const updatedZones = zones.filter((zone: any) => zone.id !== id);

      if (zones.length === updatedZones.length) {
        return res.status(404).json({ error: 'Zone not found.' });
      }

      await fs.writeFile(zonesFilePath, JSON.stringify(updatedZones, null, 2), 'utf-8');
      return res.status(200).json({ message: 'Zone deleted successfully.' });
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
