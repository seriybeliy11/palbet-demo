"use client"

import { Header } from "@/components/header"
import { EventCard } from "@/components/event-card"
import { BettingChart } from "@/components/betting-chart"
import { BettingInterface } from "@/components/betting-interface"
import { WalletStatus } from "@/components/wallet-status"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { MobileWalletSection } from "@/components/mobile-wallet-section"
import { useState } from "react"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<"chart" | "betting" | "wallet">("betting")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Desktop Layout */}
      <main className="container mx-auto px-4 py-6 space-y-6 hidden md:block">
        <WalletStatus />
        <EventCard />
        <BettingChart />
        <BettingInterface />
      </main>

      {/* Mobile Layout */}
      <main className="md:hidden">
        <div className="px-4 py-4">
          <EventCard />
        </div>

        <div className="px-4 pb-20">
          {activeSection === "chart" && (
            <div className="space-y-4">
              <BettingChart />
            </div>
          )}

          {activeSection === "betting" && (
            <div className="space-y-4">
              <WalletStatus />
              <BettingInterface />
            </div>
          )}

          {activeSection === "wallet" && <MobileWalletSection />}
        </div>

        <MobileBottomNav activeSection={activeSection} onSectionChange={setActiveSection} />
      </main>
    </div>
  )
}
