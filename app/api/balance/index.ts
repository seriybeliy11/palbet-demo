import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchTonBalance } from './utils/ton-api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const walletAddress = req.query.walletAddress as string;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const balanceInTon = await fetchTonBalance(walletAddress);
    // Convert TON to USDT (assuming 1 TON = 2.5 USDT)
    const balanceInUSDT = balanceInTon * 2.5;

    return res.status(200).json({
      walletAddress,
      balance: Number(balanceInUSDT.toFixed(4)),
      currency: 'USDT',
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
