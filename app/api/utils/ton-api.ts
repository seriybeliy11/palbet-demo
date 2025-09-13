export async function fetchTonBalance(address: string): Promise<number> {
  try {
    const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`);
    const data = await response.json();

    if (data.ok) {
      return Number.parseInt(data.result) / 1000000000; // Convert nanotons to TON
    }
    return 0;
  } catch (error) {
    console.error('Error fetching TON balance:', error);
    return 0;
  }
}
