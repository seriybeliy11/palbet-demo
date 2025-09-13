"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { BetConfirmationModal } from "@/components/bet-confirmation-modal"
import { useNotifications } from "@/components/notification-system"
import { useTonWallet } from "@tonconnect/ui-react"
import { useState, useEffect, useRef } from "react"
import { TrendingUp, TrendingDown, Calculator, Zap } from "lucide-react"

export function BettingInterface() {
  const wallet = useTonWallet()
  const { showBetSuccess, showBetError, showOddsChange } = useNotifications()
  const [betAmount, setBetAmount] = useState([1000])
  const [customAmount, setCustomAmount] = useState("")
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [yesOdds, setYesOdds] = useState(1.85)
  const [noOdds, setNoOdds] = useState(2.15)
  const prevYesOdds = useRef(yesOdds)
  const prevNoOdds = useRef(noOdds)

  useEffect(() => {
    const interval = setInterval(() => {
      const newYesOdds = yesOdds + (Math.random() - 0.5) * 0.05
      const newNoOdds = noOdds + (Math.random() - 0.5) * 0.05

      if (Math.abs(newYesOdds - prevYesOdds.current) > 0.04) {
        showOddsChange("yes", prevYesOdds.current, newYesOdds)
        prevYesOdds.current = newYesOdds
      }

      if (Math.abs(newNoOdds - prevNoOdds.current) > 0.04) {
        showOddsChange("no", prevNoOdds.current, newNoOdds)
        prevNoOdds.current = newNoOdds
      }

      setYesOdds(Math.max(1.1, Math.min(5.0, newYesOdds)))
      setNoOdds(Math.max(1.1, Math.min(5.0, newNoOdds)))
    }, 8000)

    return () => clearInterval(interval)
  }, [yesOdds, noOdds, showOddsChange])

  const potentialWinning = selectedOutcome ? betAmount[0] * (selectedOutcome === "yes" ? yesOdds : noOdds) : 0
  const profit = potentialWinning - betAmount[0]
  const commission = betAmount[0] * 0.02
  const netProfit = profit - commission

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100000) {
      setBetAmount([numValue])
    }
  }

  const handleSliderChange = (value: number[]) => {
    setBetAmount(value)
    setCustomAmount(value[0].toString())
  }

  const handleQuickAmount = (amount: number) => {
    setBetAmount([amount])
    setCustomAmount(amount.toString())
  }

  const handlePlaceBet = () => {
    if (!wallet || !selectedOutcome) return
    setShowConfirmModal(true)
  }

  const handleConfirmBet = async () => {
    if (!wallet || !selectedOutcome) return

    setIsProcessing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Placing bet:", {
        outcome: selectedOutcome,
        amount: betAmount[0],
        wallet: wallet.account.address,
        odds: selectedOutcome === "yes" ? yesOdds : noOdds,
        commission,
        expectedProfit: netProfit,
      })

      showBetSuccess(selectedOutcome, betAmount[0], netProfit)

      setSelectedOutcome(null)
      setBetAmount([1000])
      setCustomAmount("1000")
    } catch (error) {
      console.error("Bet placement failed:", error)
      showBetError("Network error. Please check your connection and try again.")
    } finally {
      setIsProcessing(false)
      setShowConfirmModal(false)
    }
  }

  const betDetails = selectedOutcome
    ? {
        outcome: selectedOutcome,
        amount: betAmount[0],
        odds: selectedOutcome === "yes" ? yesOdds : noOdds,
        potentialPayout: potentialWinning,
        commission,
        netProfit,
      }
    : null

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedOutcome === "yes"
                ? "ring-2 ring-green-500 bg-green-50 border-green-200 shadow-lg md:scale-105"
                : "hover:bg-green-50/50 hover:border-green-200 hover:shadow-md"
            }`}
            onClick={() => setSelectedOutcome("yes")}
          >
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-green-600 flex items-center justify-center space-x-2 text-lg md:text-xl">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                <span>YES</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{yesOdds.toFixed(2)}x</div>
              <div className="text-sm text-muted-foreground mb-3">Current multiplier</div>
              <div className="bg-green-100 rounded-lg p-3">
                <div className="text-xs text-green-700 font-medium">Implied Probability</div>
                <div className="text-base md:text-lg font-bold text-green-800">{((1 / yesOdds) * 100).toFixed(1)}%</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 ${
              selectedOutcome === "no"
                ? "ring-2 ring-red-500 bg-red-50 border-red-200 shadow-lg md:scale-105"
                : "hover:bg-red-50/50 hover:border-red-200 hover:shadow-md"
            }`}
            onClick={() => setSelectedOutcome("no")}
          >
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-red-600 flex items-center justify-center space-x-2 text-lg md:text-xl">
                <TrendingDown className="h-4 w-4 md:h-5 md:w-5" />
                <span>NO</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">{noOdds.toFixed(2)}x</div>
              <div className="text-sm text-muted-foreground mb-3">Current multiplier</div>
              <div className="bg-red-100 rounded-lg p-3">
                <div className="text-xs text-red-700 font-medium">Implied Probability</div>
                <div className="text-base md:text-lg font-bold text-red-800">{((1 / noOdds) * 100).toFixed(1)}%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Calculator className="h-4 w-4 md:h-5 md:w-5" />
              <span>Place Your Bet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Quick Amounts</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    variant={betAmount[0] === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickAmount(amount)}
                    className="text-xs md:text-sm"
                  >
                    {amount >= 1000 ? `${amount / 1000}K` : amount.toString()}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Custom Amount (USDT)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={1}
                max={100000}
                className="text-base md:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium">Bet Amount</label>
                <span className="text-lg md:text-xl font-bold text-primary">{betAmount[0].toLocaleString()} USDT</span>
              </div>
              <Slider
                value={betAmount}
                onValueChange={handleSliderChange}
                max={100000}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 USDT</span>
                <span>100K USDT</span>
              </div>
            </div>

            {selectedOutcome && (
              <div className="bg-accent/20 p-3 md:p-4 rounded-lg border">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm md:text-base">Bet Summary</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Selected Outcome:</span>
                    <span className={`font-bold ${selectedOutcome === "yes" ? "text-green-600" : "text-red-600"}`}>
                      {selectedOutcome.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bet Amount:</span>
                    <span>{betAmount[0].toLocaleString()} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Multiplier:</span>
                    <span>{(selectedOutcome === "yes" ? yesOdds : noOdds).toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Commission (2%):</span>
                    <span className="text-red-600">-{commission.toFixed(2)} USDT</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Potential Payout:</span>
                      <span className="text-primary">{potentialWinning.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span>Net Profit:</span>
                      <span className={netProfit > 0 ? "text-green-600" : "text-red-600"}>
                        {netProfit > 0 ? "+" : ""}
                        {netProfit.toFixed(2)} USDT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="w-full text-sm md:text-base"
              size="lg"
              disabled={!selectedOutcome || !wallet || betAmount[0] < 1}
              onClick={handlePlaceBet}
            >
              {!wallet
                ? "Connect Wallet First"
                : !selectedOutcome
                  ? "Select Outcome First"
                  : `Place Bet - ${betAmount[0].toLocaleString()} USDT`}
            </Button>
          </CardContent>
        </Card>
      </div>

      <BetConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmBet}
        betDetails={betDetails}
        isProcessing={isProcessing}
      />
    </>
  )
}
