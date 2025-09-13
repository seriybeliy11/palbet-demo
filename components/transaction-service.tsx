"use client"

import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"

export interface BetTransaction {
  amount: number // Amount in USDT
  outcome: "yes" | "no"
  eventId: string
  odds: number
}

export interface TransactionResult {
  success: boolean
  transactionHash?: string
  error?: string
}

/**
 * Сервис для обработки транзакций ставок
 *
 * Процесс транзакции:
 * 1. Проверить баланс пользователя (должен быть >= суммы ставки)
 * 2. Создать транзакцию TON для отправки средств на смарт-контракт
 * 3. Пользователь подтверждает транзакцию в кошельке
 * 4. Отправить данные транзакции на бэкэнд для записи ставки
 * 5. Обновить UI с результатом
 */
export function useTransactionService() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()

  const checkBalance = async (requiredAmount: number): Promise<boolean> => {
    if (!wallet?.account?.address) return false

    try {
      const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`)
      const data = await response.json()

      if (data.ok) {
        const balanceInTon = Number.parseInt(data.result) / 1000000000
        // Assuming 1 TON = 2.5 USDT for conversion (should be dynamic in production)
        const balanceInUSDT = balanceInTon * 2.5
        return balanceInUSDT >= requiredAmount
      }
      return false
    } catch (error) {
      console.error("Error checking balance:", error)
      return false
    }
  }

  const sendBetTransaction = async (betData: BetTransaction): Promise<TransactionResult> => {
    if (!wallet?.account?.address) {
      return { success: false, error: "Wallet not connected" }
    }

    try {
      // 1. Check balance first
      const hasBalance = await checkBalance(betData.amount)
      if (!hasBalance) {
        return { success: false, error: "Insufficient balance" }
      }

      // 2. Convert USDT to TON (simplified conversion - should be dynamic)
      const tonAmount = (betData.amount / 2.5) * 1000000000 // Convert to nanotons

      // 3. Create transaction payload
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t", // Smart contract address (placeholder)
            amount: tonAmount.toString(),
            payload: btoa(
              JSON.stringify({
                type: "bet",
                outcome: betData.outcome,
                eventId: betData.eventId,
                odds: betData.odds,
                timestamp: Date.now(),
              }),
            ),
          },
        ],
      }

      // 4. Send transaction through TON Connect
      const result = await tonConnectUI.sendTransaction(transaction)

      // 5. Send transaction data to backend
      const backendResponse = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: wallet.account.address,
          transactionHash: result.boc, // Transaction hash from TON
          amount: betData.amount,
          outcome: betData.outcome,
          eventId: betData.eventId,
          odds: betData.odds,
          timestamp: Date.now(),
        }),
      })

      if (!backendResponse.ok) {
        throw new Error("Failed to record bet on backend")
      }

      return {
        success: true,
        transactionHash: result.boc,
      }
    } catch (error: any) {
      console.error("Transaction error:", error)
      return {
        success: false,
        error: error.message || "Transaction failed",
      }
    }
  }

  return {
    sendBetTransaction,
    checkBalance,
    isWalletConnected: !!wallet?.account?.address,
  }
}
