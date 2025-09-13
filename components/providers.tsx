"use client"

import type React from "react"

import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { Toaster } from "@/components/ui/toaster"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TonConnectUIProvider manifestUrl="https://v0-bet-pal-website-design.vercel.app/tonconnect-manifest.json">
      {children}
      <Toaster />
    </TonConnectUIProvider>
  )
}
