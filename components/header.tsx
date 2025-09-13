"use client"

import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/notification-system"
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useState, useEffect } from "react"

export function Header() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const { showWalletConnected, showWalletDisconnected } = useNotifications()
  const [isConnecting, setIsConnecting] = useState(false)
  const [prevWalletState, setPrevWalletState] = useState<boolean>(false)

  useEffect(() => {
    if (wallet && !prevWalletState) {
      showWalletConnected(wallet.account.address)
      setPrevWalletState(true)
    } else if (!wallet && prevWalletState) {
      showWalletDisconnected()
      setPrevWalletState(false)
    }
  }, [wallet, prevWalletState, showWalletConnected, showWalletDisconnected])

  const handleWalletConnection = async () => {
    if (wallet) {
      await tonConnectUI.disconnect()
    } else {
      setIsConnecting(true)
      try {
        await tonConnectUI.openModal()
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      } finally {
        setIsConnecting(false)
      }
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-primary font-sans">BetPal</h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {wallet ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  {formatAddress(wallet.account.address)}
                </div>
                <Button
                  onClick={handleWalletConnection}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm bg-transparent"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleWalletConnection}
                variant="outline"
                disabled={isConnecting}
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
