"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Info, TrendingUp, TrendingDown } from "lucide-react"

export interface NotificationData {
  type: "success" | "error" | "warning" | "info" | "bet-placed" | "odds-change"
  title: string
  description?: string
  data?: any
}

export function useNotifications() {
  const { toast } = useToast()

  const showNotification = (notification: NotificationData) => {
    const getIcon = () => {
      switch (notification.type) {
        case "success":
        case "bet-placed":
          return <CheckCircle className="h-4 w-4" />
        case "error":
          return <XCircle className="h-4 w-4" />
        case "warning":
          return <AlertCircle className="h-4 w-4" />
        case "odds-change":
          return notification.data?.trend === "up" ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )
        default:
          return <Info className="h-4 w-4" />
      }
    }

    const getVariant = () => {
      switch (notification.type) {
        case "error":
          return "destructive" as const
        case "success":
        case "bet-placed":
          return "default" as const
        default:
          return "default" as const
      }
    }

    toast({
      title: (
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span>{notification.title}</span>
        </div>
      ),
      description: notification.description,
      variant: getVariant(),
      duration: notification.type === "error" ? 6000 : 4000,
    })
  }

  const showBetSuccess = (outcome: "yes" | "no", amount: number, profit: number) => {
    showNotification({
      type: "bet-placed",
      title: "Bet Placed Successfully!",
      description: `${amount.toLocaleString()} USDT on ${outcome.toUpperCase()}. Expected profit: ${profit.toFixed(2)} USDT`,
    })
  }

  const showBetError = (error: string) => {
    showNotification({
      type: "error",
      title: "Bet Failed",
      description: error || "Unable to place bet. Please try again.",
    })
  }

  const showWalletConnected = (address: string) => {
    showNotification({
      type: "success",
      title: "Wallet Connected",
      description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
    })
  }

  const showWalletDisconnected = () => {
    showNotification({
      type: "info",
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const showOddsChange = (outcome: "yes" | "no", oldOdds: number, newOdds: number) => {
    const change = newOdds - oldOdds
    const trend = change > 0 ? "up" : "down"

    showNotification({
      type: "odds-change",
      title: `${outcome.toUpperCase()} Odds ${trend === "up" ? "Increased" : "Decreased"}`,
      description: `From ${oldOdds.toFixed(2)}x to ${newOdds.toFixed(2)}x (${change > 0 ? "+" : ""}${change.toFixed(2)})`,
      data: { trend },
    })
  }

  return {
    showNotification,
    showBetSuccess,
    showBetError,
    showWalletConnected,
    showWalletDisconnected,
    showOddsChange,
  }
}
