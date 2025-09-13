"use client"

import { useTonWallet } from "@tonconnect/ui-react"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, AlertCircle } from "lucide-react"

export function WalletStatus() {
  const wallet = useTonWallet()

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
      <CardContent className="flex items-center space-x-3 p-4">
        <Wallet className="h-5 w-5 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">Wallet connected</p>
          <p className="text-xs text-green-600">{wallet.account.address}</p>
        </div>
      </CardContent>
    </Card>
  )
}
