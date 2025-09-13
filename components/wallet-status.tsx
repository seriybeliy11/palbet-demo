"use client"

import { useTonWallet } from "@tonconnect/ui-react"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, AlertCircle, Coins } from "lucide-react"
import { useEffect, useState } from "react"

interface WalletBalance {
  balance: string
  isLoading: boolean
}

export function WalletStatus() {
  const wallet = useTonWallet()
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    balance: "0",
    isLoading: false,
  })

  const fetchWalletBalance = async (address: string) => {
    setWalletBalance((prev) => ({ ...prev, isLoading: true }))

    try {
      // TON API endpoint for getting account balance
      const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${address}`)
      const data = await response.json()

      if (data.ok) {
        // Convert from nanotons to TON (1 TON = 1,000,000,000 nanotons)
        const balanceInTon = (Number.parseInt(data.result) / 1000000000).toFixed(4)
        setWalletBalance({ balance: balanceInTon, isLoading: false })
      } else {
        setWalletBalance({ balance: "0", isLoading: false })
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
      setWalletBalance({ balance: "0", isLoading: false })
    }
  }

  useEffect(() => {
    if (wallet?.account?.address) {
      fetchWalletBalance(wallet.account.address)
    }
  }, [wallet?.account?.address])

  if (!wallet) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="flex items-center space-x-3 p-4">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Wallet not connected</p>
            <p className="text-xs text-yellow-600">Connect your TON wallet to place bets</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Wallet className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Wallet connected</p>
            <p className="text-xs text-green-600 font-mono">
              {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="h-4 w-4 text-green-600" />
          <div className="text-right">
            <p className="text-sm font-bold text-green-800">
              {walletBalance.isLoading ? "..." : walletBalance.balance} TON
            </p>
            <button
              onClick={() => wallet.account.address && fetchWalletBalance(wallet.account.address)}
              className="text-xs text-green-600 hover:text-green-700 underline"
            >
              Refresh
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
