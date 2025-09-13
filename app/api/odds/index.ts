import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const eventId = req.query.eventId as string;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Simulate dynamic odds calculation (in production, fetch from a market data source or smart contract)
    const yesOdds = 1.85 + (Math.random() - 0.5) * 0.1;
    const noOdds = 2.15 + (Math.random() - 0.5) * 0.1;

    return res.status(200).json({
      eventId,
      yesOdds: Number(yesOdds.toFixed(2)),
      noOdds: Number(noOdds.toFixed(2)),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching odds:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
