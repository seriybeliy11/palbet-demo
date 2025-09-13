import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import { verifyTonSignature } from './utils/ton-verifier';
import { fetchTonBalance } from './utils/ton-api';

const MONGODB_URI = process.env.MONGODB_URI || '';
const client = new MongoClient(MONGODB_URI);

interface BetRequestBody {
  walletAddress: string;
  transactionHash: string;
  amount: number;
  outcome: 'yes' | 'no';
  eventId: string;
  odds: number;
  timestamp: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress, transactionHash, amount, outcome, eventId, odds, timestamp } = req.body as BetRequestBody;

  // Input validation
  if (!walletAddress || !transactionHash || !amount || !outcome || !eventId || !odds || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['yes', 'no'].includes(outcome)) {
    return res.status(400).json({ error: 'Invalid outcome' });
  }

  if (amount <= 0 || odds <= 1) {
    return res.status(400).json({ error: 'Invalid amount or odds' });
  }

  try {
    await client.connect();
    const db = client.db('betpal');
    const betsCollection = db.collection('bets');

    // Verify TON transaction
    const isValidTx = await verifyTonSignature(transactionHash, walletAddress);
    if (!isValidTx) {
      return res.status(400).json({ error: 'Invalid transaction signature' });
    }

    // Check balance (convert USDT to TON, assuming 1 TON = 2.5 USDT)
    const tonAmount = amount / 2.5;
    const balance = await fetchTonBalance(walletAddress);
    if (balance < tonAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Store bet
    const bet = {
      walletAddress,
      transactionHash,
      amount,
      outcome,
      eventId,
      odds,
      timestamp,
      status: 'pending',
      createdAt: new Date(),
    };

    await betsCollection.insertOne(bet);

    return res.status(201).json({
      success: true,
      betId: bet._id,
      transactionHash,
    });
  } catch (error) {
    console.error('Error recording bet:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
