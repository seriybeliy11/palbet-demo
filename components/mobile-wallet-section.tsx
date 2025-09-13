"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletStatus } from "@/components/wallet-status"
import { useTonWallet } from "@tonconnect/ui-react"
import { Wallet, History } from "lucide-react"

export function MobileWalletSection() {
  const wallet = useTonWallet()

  return (
    <div className="space-y-4 pb-20">
      <WalletStatus />

      {wallet && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Wallet className="h-5 w-5" />
                <span>Wallet Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Address</div>
                <div className="font-mono text-sm break-all">{wallet.account.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-xs text-green-700">Active Bets</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-xs text-blue-700">Total Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <History className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Your betting history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
