import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const client = new MongoClient(MONGODB_URI);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const walletAddress = req.query.walletAddress as string;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    await client.connect();
    const db = client.db('betpal');
    const betsCollection = db.collection('bets');

    const bets = await betsCollection
      .find({ walletAddress })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return res.status(200).json({
      success: true,
      bets: bets.map(bet => ({
        betId: bet._id,
        eventId: bet.eventId,
        amount: bet.amount,
        outcome: bet.outcome,
        odds: bet.odds,
        status: bet.status,
        timestamp: bet.timestamp,
        createdAt: bet.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching bet history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
