"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Wallet } from "lucide-react"

interface MobileBottomNavProps {
  activeSection: "chart" | "betting" | "wallet"
  onSectionChange: (section: "chart" | "betting" | "wallet") => void
}

export function MobileBottomNav({ activeSection, onSectionChange }: MobileBottomNavProps) {
  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around py-3">
        <Button
          variant={activeSection === "chart" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("chart")}
          className="flex-col h-auto py-3 px-4 min-h-[60px] min-w-[60px] touch-manipulation"
        >
          <BarChart3 className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Chart</span>
        </Button>
        <Button
          variant={activeSection === "betting" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("betting")}
          className="flex-col h-auto py-3 px-4 min-h-[60px] min-w-[60px] touch-manipulation"
        >
          <TrendingUp className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Bet</span>
        </Button>
        <Button
          variant={activeSection === "wallet" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("wallet")}
          className="flex-col h-auto py-3 px-4 min-h-[60px] min-w-[60px] touch-manipulation"
        >
          <Wallet className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Wallet</span>
        </Button>
      </div>
    </Card>
  )
}
