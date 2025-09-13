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
      <div className="flex items-center justify-around py-2">
        <Button
          variant={activeSection === "chart" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("chart")}
          className="flex-col h-auto py-2 px-3"
        >
          <BarChart3 className="h-4 w-4 mb-1" />
          <span className="text-xs">Chart</span>
        </Button>
        <Button
          variant={activeSection === "betting" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("betting")}
          className="flex-col h-auto py-2 px-3"
        >
          <TrendingUp className="h-4 w-4 mb-1" />
          <span className="text-xs">Bet</span>
        </Button>
        <Button
          variant={activeSection === "wallet" ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange("wallet")}
          className="flex-col h-auto py-2 px-3"
        >
          <Wallet className="h-4 w-4 mb-1" />
          <span className="text-xs">Wallet</span>
        </Button>
      </div>
    </Card>
  )
}
