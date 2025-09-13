import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const betData = await request.json()

    // Validate required fields
    const requiredFields = ["walletAddress", "transactionHash", "amount", "outcome", "eventId", "odds"]
    for (const field of requiredFields) {
      if (!betData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Here you would typically:
    // 1. Verify the transaction on TON blockchain
    // 2. Save bet to database
    // 3. Update event statistics
    // 4. Send confirmation to user

    console.log("Recording bet:", betData)

    // Simulate database save
    // await db.bets.create({
    //   walletAddress: betData.walletAddress,
    //   transactionHash: betData.transactionHash,
    //   amount: betData.amount,
    //   outcome: betData.outcome,
    //   eventId: betData.eventId,
    //   odds: betData.odds,
    //   timestamp: betData.timestamp,
    //   status: 'confirmed'
    // })

    return NextResponse.json({
      success: true,
      betId: `bet_${Date.now()}`,
      message: "Bet recorded successfully",
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
