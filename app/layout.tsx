import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "BetPal - Prediction Market",
  description: "BetPal betting application for prediction markets",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${manrope.variable} antialiased`}>
        <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
          <Suspense fallback={null}>{children}</Suspense>
        </TonConnectUIProvider>
        <Analytics />
      </body>
    </html>
  )
}
