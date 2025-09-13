"use client"

import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { useState, useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode
}

function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const [TonConnectUIProvider, setTonConnectUIProvider] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import TON Connect to handle import errors gracefully
    import("@tonconnect/ui-react")
      .then((module) => {
        setTonConnectUIProvider(() => module.TonConnectUIProvider)
        setIsLoaded(true)
      })
      .catch((error) => {
        console.warn("TON Connect not available:", error)
        setIsLoaded(true)
      })
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (TonConnectUIProvider) {
    return <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">{children}</TonConnectUIProvider>
  }

  // Fallback when TON Connect is not available
  return <>{children}</>
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TonConnectProvider>
      {children}
      <Toaster />
    </TonConnectProvider>
  )
}
