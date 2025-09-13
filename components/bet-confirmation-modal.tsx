"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface BetConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  betDetails: {
    outcome: "yes" | "no"
    amount: number
    odds: number
    potentialPayout: number
    commission: number
    netProfit: number
  } | null
  isProcessing: boolean
}

export function BetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  betDetails,
  isProcessing,
}: BetConfirmationModalProps) {
  if (!betDetails) return null

  const { outcome, amount, odds, potentialPayout, commission, netProfit } = betDetails

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-full ${
                outcome === "yes" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              {outcome === "yes" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
            <span>Confirm Your Bet</span>
          </DialogTitle>
          <DialogDescription>
            Review your bet details before confirming. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-accent/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Betting On:</span>
              <Badge variant={outcome === "yes" ? "default" : "destructive"} className="text-sm">
                {outcome.toUpperCase()}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium text-muted-foreground">Peace Agreement in 2025</div>
              <div className="text-sm text-muted-foreground">Ukraine/USA/Russia</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Bet Amount:</span>
              <span className="font-medium">{amount.toLocaleString()} USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Multiplier:</span>
              <span className="font-medium">{odds.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Commission (2%):</span>
              <span className="text-red-600 font-medium">-{commission.toFixed(2)} USDT</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Potential Payout:</span>
              <span className="font-bold text-primary">{potentialPayout.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Net Profit:</span>
              <span className={`font-bold ${netProfit > 0 ? "text-green-600" : "text-red-600"}`}>
                {netProfit > 0 ? "+" : ""}
                {netProfit.toFixed(2)} USDT
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium mb-1">Important Notice:</p>
              <p>
                Prediction markets involve risk. Only bet what you can afford to lose. Odds may change before your bet
                is confirmed.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing} className="w-full sm:w-auto">
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Confirm Bet</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
